from core.applications.fs_utils import verify_folder, get_application_directory


def create_application_directory(application_id):
    application_directory = get_application_directory(application_id)
    verify_folder(application_directory)
    return application_directory


def to_boolean(var):
    if isinstance(var, bool):
        return var
    if isinstance(var, str):
        return False if len(var) == 0 else str(var).lower() in 'true'
