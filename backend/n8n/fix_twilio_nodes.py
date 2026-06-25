import os
import json
import glob

def fix_twilio_nodes():
    files = glob.glob('backend/n8n/*.json')
    for filepath in files:
        with open(filepath, 'r') as f:
            data = json.load(f)
            
        modified = False
        for node in data.get('nodes', []):
            if node.get('type') == 'n8n-nodes-base.twilio':
                print(f"Fixing {node['name']} in {filepath}")
                
                # Extract original properties
                phone_number = node['parameters'].get('phoneNumber', '')
                if not phone_number:
                    # In case it used 'to' instead of 'phoneNumber'
                    phone_number = node['parameters'].get('to', '')
                    
                message = node['parameters'].get('message', '')
                
                # Transform into HTTP request node
                node['type'] = 'n8n-nodes-base.httpRequest'
                node['typeVersion'] = 4.1
                node['parameters'] = {
                    "method": "POST",
                    "url": "http://localhost:5000/api/v1/automation-logs/whatsapp-dispatch",
                    "sendHeaders": True,
                    "headerParameters": {
                        "parameters": [
                            {
                                "name": "X-Automation-Token",
                                "value": "campusflow_secret"
                            },
                            {
                                "name": "Content-Type",
                                "value": "application/json"
                            }
                        ]
                    },
                    "sendBody": True,
                    "bodyParameters": {
                        "parameters": [
                            {
                                "name": "phone_number",
                                "value": phone_number
                            },
                            {
                                "name": "message",
                                "value": message
                            }
                        ]
                    }
                }
                modified = True
                
        if modified:
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            print(f"Saved {filepath}")

if __name__ == '__main__':
    fix_twilio_nodes()
