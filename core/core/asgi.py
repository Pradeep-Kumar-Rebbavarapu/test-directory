"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.0/howto/deployment/asgi/
"""

import os
import django
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
# application = get_asgi_application()

from django.urls import path
from chat import consumers
websocket_urlpatterns = [
    path('ws/chat/<room_name>/',consumers.ChatRoomConsumer.as_asgi())
]

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter,URLRouter
application = ProtocolTypeRouter({
    'websocket':URLRouter(websocket_urlpatterns)
})