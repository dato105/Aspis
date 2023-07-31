import mimetypes
import os
import pathlib
import shutil
from os.path import exists

from django.conf import settings
from django.core.files.uploadedfile import InMemoryUploadedFile, TemporaryUploadedFile
from django.http import FileResponse
from rest_framework import status

from ..models import Application


def verify_folder(folder_path):
    pathlib.Path(folder_path).mkdir(parents=True, exist_ok=True)


def copy_to_application_directory(file, application_id):
    filename = file.name
    output_path = os.path.join(get_application_directory(application_id), filename)
    if isinstance(file, InMemoryUploadedFile):
        file_content = file.file.getvalue()
        write_file_bytes(file_content, output_path)
    elif isinstance(file, TemporaryUploadedFile):
        shutil.copy(file.temporary_file_path(), output_path)


def delete_file_from_app_dir(filename, application_id):
    full_path = os.path.join(get_application_directory(application_id), filename)
    if exists(full_path):
        os.remove(full_path)


def get_applications_fs_path():
    return os.path.normpath(settings.ASAP_APPLICATION_DIR)


def get_application_directory(application_id):
    return os.path.join(get_applications_fs_path(), str(application_id))


def read_file(filepath):
    with open(filepath, 'r') as f:
        return f.read()


def write_file(filepath, content):
    with open(filepath, 'w') as f:
        f.write(content)


def write_file_bytes(content_in_bytes, filepath):
    with open(filepath, 'wb+') as f:
        f.write(content_in_bytes)


def get_document(application_id, file_prop_name_in_state):
    application = Application.objects.get(pk=application_id)
    application_state = application.application_state
    application_directory = get_application_directory(application_id)
    filename = application_state[file_prop_name_in_state]
    file_path = os.path.join(application_directory, filename)
    file = open(file_path, 'rb')
    mime_type, _ = mimetypes.guess_type(file_path)
    response = FileResponse(file, content_type=mime_type, status=status.HTTP_200_OK)
    response['Content-Disposition'] = "attachment; filename=%s" % filename
    return response


def delete_file_from_app_dir(filename, application_id):
    full_path = os.path.join(get_application_directory(application_id), filename)
    if exists(full_path):
        os.remove(full_path)
        return True
    return False
