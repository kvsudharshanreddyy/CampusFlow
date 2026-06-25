const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../n8n');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const workflows = {
  welcome_workflow: {
    name: "Welcome Workflow",
    nodes: [
      {
        parameters: {
          path: "welcome-trigger",
          options: {}
        },
        id: "node-1",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [250, 300]
      },
      {
        parameters: {
          message: "Welcome to CampusFlow! Your account is active. Start organizing your schedule and deadlines dynamically."
        },
        id: "node-2",
        name: "Send Welcome WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [480, 300]
      },
      {
        parameters: {
          workflowId: "n8n_logging_helper",
          options: {
            workflowParameters: {
              parameters: [
                { name: "workflow_name", value: "Welcome Workflow" },
                { name: "status", value: "success" },
                { name: "message", value: "Welcome notification message sent successfully." }
              ]
            }
          }
        },
        id: "node-3",
        name: "Log Success",
        type: "n8n-nodes-base.executeWorkflow",
        typeVersion: 1,
        position: [700, 300]
      }
    ],
    connections: {
      "Webhook Trigger": { main: [[{ node: "Send Welcome WhatsApp", type: "main", index: 0 }]] },
      "Send Welcome WhatsApp": { main: [[{ node: "Log Success", type: "main", index: 0 }]] }
    }
  },

  deadline_reminder: {
    name: "Deadline Reminder",
    nodes: [
      {
        parameters: {
          rule: {
            interval: [
              {
                field: "cronExpression",
                expression: "0 9 * * *"
              }
            ]
          }
        },
        id: "node-1",
        name: "Daily Check cron",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.1,
        position: [200, 300]
      },
      {
        parameters: {
          url: "http://localhost:5000/api/v1/tasks?status=pending",
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "Authorization", value: "Bearer dev_token" }]
          }
        },
        id: "node-2",
        name: "Fetch Pending Tasks",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [400, 300]
      },
      {
        parameters: {
          message: "Friendly reminder: You have tasks due tomorrow. Check your CampusFlow tasks list."
        },
        id: "node-3",
        name: "Send Deadline WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [600, 300]
      }
    ],
    connections: {
      "Daily Check cron": { main: [[{ node: "Fetch Pending Tasks", type: "main", index: 0 }]] },
      "Fetch Pending Tasks": { main: [[{ node: "Send Deadline WhatsApp", type: "main", index: 0 }]] }
    }
  },

  notice_broadcast: {
    name: "Notice Broadcast",
    nodes: [
      {
        parameters: { path: "new-notice", options: {} },
        id: "node-1",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [200, 300]
      },
      {
        parameters: {
          message: "Notice Broadcast: A new campus announcement has been published. Title: {{$json.title}}."
        },
        id: "node-2",
        name: "Send Broadcast WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [420, 300]
      }
    ],
    connections: {
      "Webhook Trigger": { main: [[{ node: "Send Broadcast WhatsApp", type: "main", index: 0 }]] }
    }
  },

  study_session_reminder: {
    name: "Study Session Reminder",
    nodes: [
      {
        parameters: {
          rule: { interval: [{ field: "cronExpression", expression: "*/15 * * * *" }] }
        },
        id: "node-1",
        name: "Check Every 15 Mins",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.1,
        position: [200, 300]
      },
      {
        parameters: {
          message: "Reminder: You have a scheduled study session starting in 15 minutes."
        },
        id: "node-2",
        name: "Send Session WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [450, 300]
      }
    ],
    connections: {
      "Check Every 15 Mins": { main: [[{ node: "Send Session WhatsApp", type: "main", index: 0 }]] }
    }
  },

  attendance_reminder: {
    name: "Attendance Reminder",
    nodes: [
      {
        parameters: {
          rule: { interval: [{ field: "cronExpression", expression: "0 10 * * 1" }] }
        },
        id: "node-1",
        name: "Weekly Monday Check",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.1,
        position: [200, 300]
      },
      {
        parameters: {
          url: "http://localhost:5000/api/v1/attendance/summary",
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "Authorization", value: "Bearer dev_token" }]
          }
        },
        id: "node-2",
        name: "Fetch Attendance Summary",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [400, 300]
      },
      {
        parameters: {
          message: "Warning: Your attendance in {{$json.code}} is below the 75% requirement. Current percentage: {{$json.percentage}}%."
        },
        id: "node-3",
        name: "Send Warning WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [620, 300]
      }
    ],
    connections: {
      "Weekly Monday Check": { main: [[{ node: "Fetch Attendance Summary", type: "main", index: 0 }]] },
      "Fetch Attendance Summary": { main: [[{ node: "Send Warning WhatsApp", type: "main", index: 0 }]] }
    }
  },

  placement_reminder: {
    name: "Placement Reminder",
    nodes: [
      {
        parameters: { path: "placement-update", options: {} },
        id: "node-1",
        name: "Webhook Trigger",
        type: "n8n-nodes-base.webhook",
        typeVersion: 1,
        position: [200, 300]
      },
      {
        parameters: {
          message: "Placement Update: Your application status for {{$json.company}} (Role: {{$json.role_title}}) has updated to {{$json.status}}."
        },
        id: "node-2",
        name: "Send Placement WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [420, 300]
      }
    ],
    connections: {
      "Webhook Trigger": { main: [[{ node: "Send Placement WhatsApp", type: "main", index: 0 }]] }
    }
  },

  daily_summary: {
    name: "Daily Summary",
    nodes: [
      {
        parameters: {
          rule: { interval: [{ field: "cronExpression", expression: "0 8 * * *" }] }
        },
        id: "node-1",
        name: "Cron Morning",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.1,
        position: [200, 300]
      },
      {
        parameters: {
          url: "http://localhost:5000/api/v1/dashboard/stats",
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "Authorization", value: "Bearer dev_token" }]
          }
        },
        id: "node-2",
        name: "Fetch Stats",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [420, 300]
      },
      {
        parameters: {
          message: "Daily CampusFlow Roundup: You have {{$json.tasks.pending}} pending tasks and {{$json.today_events_count}} events scheduled today."
        },
        id: "node-3",
        name: "Send Daily Summary WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [640, 300]
      }
    ],
    connections: {
      "Cron Morning": { main: [[{ node: "Fetch Stats", type: "main", index: 0 }]] },
      "Fetch Stats": { main: [[{ node: "Send Daily Summary WhatsApp", type: "main", index: 0 }]] }
    }
  },

  weekly_summary: {
    name: "Weekly Summary",
    nodes: [
      {
        parameters: {
          rule: { interval: [{ field: "cronExpression", expression: "0 18 * * 7" }] }
        },
        id: "node-1",
        name: "Cron Sunday Evening",
        type: "n8n-nodes-base.scheduleTrigger",
        typeVersion: 1.1,
        position: [200, 300]
      },
      {
        parameters: {
          message: "Weekly Summary: Congratulations! You completed {{$json.tasks_completed}} tasks this week. Keep up the streak!"
        },
        id: "node-2",
        name: "Send Weekly Summary WhatsApp",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [420, 300]
      }
    ],
    connections: {
      "Cron Sunday Evening": { main: [[{ node: "Send Weekly Summary WhatsApp", type: "main", index: 0 }]] }
    }
  },

  calendar_sync: {
    name: "Calendar Sync",
    nodes: [
      {
        parameters: {
          pollTimes: {
            rule: [{ field: "cronExpression", expression: "*/10 * * * *" }]
          }
        },
        id: "node-1",
        name: "Google Calendar Trigger",
        type: "n8n-nodes-base.googleCalendarTrigger",
        typeVersion: 1,
        position: [200, 300]
      },
      {
        parameters: {
          method: "POST",
          url: "http://localhost:5000/api/v1/calendar-events",
          sendHeaders: true,
          headerParameters: {
            parameters: [{ name: "Authorization", value: "Bearer dev_token" }]
          },
          sendBody: true,
          bodyParameters: {
            parameters: [
              { name: "provider_event_id", value: "={{$json.id}}" },
              { name: "title", value: "={{$json.summary}}" },
              { name: "description", value: "={{$json.description}}" },
              { name: "start_time", value: "={{$json.start.dateTime}}" },
              { name: "end_time", value: "={{$json.end.dateTime}}" }
            ]
          }
        },
        id: "node-2",
        name: "Add to Local Calendar",
        type: "n8n-nodes-base.httpRequest",
        typeVersion: 4.1,
        position: [450, 300]
      }
    ],
    connections: {
      "Google Calendar Trigger": { main: [[{ node: "Add to Local Calendar", type: "main", index: 0 }]] }
    }
  }
};

Object.entries(workflows).forEach(([key, val]) => {
  const filePath = path.join(targetDir, `${key}.json`);
  const content = JSON.stringify(val, null, 2);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Generated workflow config: ${key}.json`);
});

console.log('All n8n workflows generated successfully.');
