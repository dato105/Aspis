from rest_framework import status
from rest_framework.response import Response


def authorized_roles(roles=None):
    if roles is None:
        roles = []

    def decorator(view_func):
        def wrapper_func(request, *args, **kwargs):
            user_roles = set([])
            if request.user.groups.exists():
                user_roles = set(request.user.groups.values_list('name', flat=True))
            if user_roles & set(roles):
                return view_func(request, *args, **kwargs)
            else:
                return Response('You are not authorized to access this API', status=status.HTTP_401_UNAUTHORIZED)

        return wrapper_func

    return decorator
