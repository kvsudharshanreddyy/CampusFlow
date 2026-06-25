const notificationRepository = require('../../infrastructure/database/notificationRepository');
const taskRepository = require('../../infrastructure/database/taskRepository');
const whatsAppService = require('../../infrastructure/services/whatsapp.service');
const aiService = require('../../infrastructure/ai/aiService');
const supabase = require('../../infrastructure/database/supabase');
const logger = require('../../utils/logger');

class NotificationController {
  async getAll(req, res, next) {
    try {
      const { unread_only, limit = 20 } = req.query;
      const notifications = await notificationRepository.findByUser(req.user.id, {
        unreadOnly: unread_only === 'true',
        limit: Math.min(Number(limit), 100),
      });
      const unreadCount = await notificationRepository.countUnread(req.user.id);
      res.status(200).json({
        status: 'success',
        data: notifications,
        meta: { unread_count: unreadCount },
      });
    } catch (error) {
      next(error);
    }
  }

  async markRead(req, res, next) {
    try {
      const notif = await notificationRepository.markRead(req.params.id, req.user.id);
      if (!notif) {
        const err = new Error('Notification not found'); err.statusCode = 404; throw err;
      }
      res.status(200).json({ status: 'success', message: 'Marked as read', data: notif });
    } catch (error) {
      next(error);
    }
  }

  async markAllRead(req, res, next) {
    try {
      await notificationRepository.markAllRead(req.user.id);
      res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles incoming Twilio WhatsApp webhook.
   * Parses messages like "done DBMS Assignment", "completed OS notes", "mark complete"
   * and marks the relevant task as complete, then sends a WhatsApp confirmation.
   */
  async handleTwilioWebhook(req, res, next) {
    try {
      const { Body, From, To } = req.body;
      const incomingMessage = (Body || '').trim().toLowerCase();
      const senderPhone = (From || '').replace('whatsapp:', '');

      logger.info(`[Twilio Webhook] Incoming WhatsApp from ${senderPhone}: "${Body}"`);

      // Log incoming message
      try {
        await supabase.from('whatsapp_logs').insert([{
          phone_number: senderPhone,
          message_content: Body,
          direction: 'inbound',
          status: 'received',
          created_at: new Date().toISOString()
        }]);
      } catch (logErr) {
        logger.warn(`Failed to log incoming WhatsApp: ${logErr.message}`);
      }

      // Detect task completion intent
      const completionKeywords = ['done', 'completed', 'finished', 'complete', 'mark complete', 'done with', 'finish'];
      const isCompletion = completionKeywords.some(kw => incomingMessage.includes(kw));

      // Detect task creation intent via WhatsApp (e.g., "Add DBMS Assignment tomorrow at 6 PM")
      const creationKeywords = ['add ', 'create ', 'remind me', 'set reminder', 'task for'];
      const isCreation = creationKeywords.some(kw => incomingMessage.startsWith(kw));

      if (isCompletion) {
        // Extract task title from message (e.g., "done DBMS Assignment" -> "DBMS Assignment")
        let taskTitle = Body.trim();
        completionKeywords.forEach(kw => {
          const regex = new RegExp(`^(${kw})\\s+`, 'i');
          taskTitle = taskTitle.replace(regex, '');
        });
        taskTitle = taskTitle.trim();

        // Find user by phone number in profiles
        const { data: profileRecord } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('phone_number', senderPhone)
          .single();

        let replyMessage;

        if (profileRecord) {
          const userId = profileRecord.id;
          const userName = profileRecord.first_name || 'Student';
          // Find matching task
          let matchedTask = null;

          if (taskTitle) {
            const { data: tasks } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', userId)
              .eq('status', 'pending')
              .ilike('title', `%${taskTitle}%`)
              .limit(1);

            if (tasks && tasks.length > 0) {
              matchedTask = tasks[0];
            }
          }

          if (!matchedTask) {
            // Get most recent pending task
            const { data: tasks } = await supabase
              .from('tasks')
              .select('*')
              .eq('user_id', userId)
              .eq('status', 'pending')
              .order('due_date', { ascending: true })
              .limit(1);

            if (tasks && tasks.length > 0) {
              matchedTask = tasks[0];
            }
          }

          if (matchedTask) {
            // Mark task as completed
            await supabase
              .from('tasks')
              .update({ status: 'completed', updated_at: new Date().toISOString() })
              .eq('id', matchedTask.id);

            // Fetch any linked calendar event
            const { data: calendarEvent } = await supabase
              .from('calendar_events')
              .select('*')
              .eq('user_id', userId)
              .ilike('title', `%${matchedTask.title}%`)
              .limit(1)
              .single();

            if (calendarEvent && calendarEvent.provider_event_id) {
               // Optional: Update calendar to prefix with [DONE]
               const googleCalendarService = require('../../infrastructure/services/googleCalendar.service');
               await googleCalendarService.syncEvent(userId, {
                 provider_event_id: calendarEvent.provider_event_id,
                 title: `[DONE] ${calendarEvent.title}`,
                 description: calendarEvent.description,
                 start_time: calendarEvent.start_time,
                 end_time: calendarEvent.end_time,
                 event_type: calendarEvent.event_type
               });
            }

            replyMessage = `✅ Great job, ${userName}!\n\n*${matchedTask.title}* has been marked as complete.\n\nKeep up the excellent work! 🎓`;
            logger.info(`[Twilio Webhook] Marked task "${matchedTask.title}" as complete for user ${userId}`);
          } else {
            replyMessage = `✅ Got it! I couldn't find a matching pending task for "${taskTitle}".\n\nYour tasks are up to date. Use the CampusFlow app to view all tasks. 📚`;
          }
        } else {
          replyMessage = `👋 Hi! Your phone number isn't registered in CampusFlow yet.\n\nPlease register at our app to link your WhatsApp to your account.`;
        }

        // Send WhatsApp reply
        await whatsAppService.sendMessage(senderPhone, replyMessage);

        // Respond to Twilio with TwiML
        res.set('Content-Type', 'text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
        return;
      }

      if (isCreation) {
        // Handle task creation via WhatsApp
        const { data: profileRecord } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('phone_number', senderPhone)
          .single();

        if (profileRecord) {
          const userId = profileRecord.id;
          // Use AI to parse the message and create a task
          try {
            const aiResponse = await aiService.generateCompletion([{
              role: 'user',
              content: `Parse this task creation request and extract: title, due_date (ISO format, assume current date is ${new Date().toISOString()}), priority (low/medium/high). Return ONLY valid JSON like: {"title": "...", "due_date": "...", "priority": "..."}
              
Message: "${Body}"`
            }], { jsonMode: true });

            let taskData;
            try {
              const jsonMatch = aiResponse.match(/\{.*\}/s);
              taskData = JSON.parse(jsonMatch ? jsonMatch[0] : aiResponse);
            } catch (parseErr) {
              taskData = { title: Body.replace(/^(add|create|remind me to|task for)\s+/i, ''), priority: 'medium' };
            }

            // Create the task
            const { data: newTask } = await supabase
              .from('tasks')
              .insert([{
                user_id: userId,
                title: taskData.title || Body,
                description: `Created via WhatsApp: ${Body}`,
                status: 'pending',
                due_date: taskData.due_date || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }])
              .select()
              .single();

            // Create Calendar Event
            const googleCalendarService = require('../../infrastructure/services/googleCalendar.service');
            let eventId = null;
            if (taskData.due_date) {
              const start_time = new Date(taskData.due_date);
              const end_time = new Date(start_time.getTime() + 60 * 60 * 1000); // 1 hour duration
              
              const calEvent = await googleCalendarService.syncEvent(userId, {
                title: taskData.title || Body,
                description: `Created via WhatsApp`,
                start_time: start_time.toISOString(),
                end_time: end_time.toISOString(),
                event_type: 'deadline'
              });
              if (calEvent && calEvent.provider_event_id) {
                eventId = calEvent.provider_event_id;
              }
            }

            // Trigger n8n Workflow
            const { triggerN8NWebhook } = require('../../utils/n8n');
            triggerN8NWebhook('calendar-sync', {
              userId,
              title: taskData.title || Body,
              start_time: taskData.due_date || new Date().toISOString(),
              end_time: taskData.due_date ? new Date(new Date(taskData.due_date).getTime() + 60*60*1000).toISOString() : new Date().toISOString(),
              event_type: 'deadline'
            });

            const dueStr = newTask?.due_date ? new Date(newTask.due_date).toLocaleString() : 'No deadline set';
            const replyMessage = `✅ Task Created!\n\n*${taskData.title || Body}*\nDue: ${dueStr}\n\nReply "done ${taskData.title}" when completed! 📝`;
            await whatsAppService.sendMessage(senderPhone, replyMessage);

          } catch (aiErr) {
            logger.error(`AI task parse error: ${aiErr.message}`);
            const replyMessage = `✅ I received your message but couldn't parse the task details.\n\nPlease use the CampusFlow app to create tasks with full details. 📱`;
            await whatsAppService.sendMessage(senderPhone, replyMessage);
          }
        } else {
          const replyMessage = `👋 Hi! Please register in the CampusFlow app first to use WhatsApp task management.`;
          await whatsAppService.sendMessage(senderPhone, replyMessage);
        }

        res.set('Content-Type', 'text/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
        return;
      }

      // Generic help response
      const helpMessage = `🎓 *CampusFlow WhatsApp Assistant*\n\nCommands:\n• "Add [task] [time]" - Create a task\n• "done [task name]" - Mark task complete\n• "completed [task]" - Mark complete\n\nExample: "done DBMS Assignment"\n\nUse the CampusFlow app for full features! 📱`;
      await whatsAppService.sendMessage(senderPhone, helpMessage);

      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
    } catch (error) {
      logger.error(`[Twilio Webhook] Error: ${error.message}`);
      res.set('Content-Type', 'text/xml');
      res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response></Response>`);
    }
  }
}

module.exports = new NotificationController();
