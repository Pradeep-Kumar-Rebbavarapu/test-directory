from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json
class ChatRoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        await(self.channel_layer.group_add)(
            self.room_group_name,self.channel_name
        )
        await self.accept()
    
    async def disconnect(self,close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self,text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        name = text_data_json['name']
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message,
                'name':name,
            }
        )
    async def chat_message(self,event):
        print(event)
        message = event['message']
        name = event['name']
        await self.send(text_data = json.dumps({
            'message':message,
            'name':name,
        }))