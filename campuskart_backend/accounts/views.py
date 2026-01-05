from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer, UserSerializer


class RegisterView(APIView):
	"""
	Registers a new user and returns their profile data.
	"""
	permission_classes = [permissions.AllowAny]

	def post(self, request, *args, **kwargs):
		serializer = RegisterSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		data = UserSerializer(user, context={'request': request}).data
		return Response(data, status=status.HTTP_201_CREATED)


class ProfileView(APIView):
	"""
	Returns the profile of the currently authenticated user.
	"""
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request, *args, **kwargs):
		serializer = UserSerializer(request.user, context={'request': request})
		return Response(serializer.data)
