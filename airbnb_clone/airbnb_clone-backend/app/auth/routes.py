from . import auth_bp

@auth_bp.route('/')
def index():
    return 'Auth Blueprint'
