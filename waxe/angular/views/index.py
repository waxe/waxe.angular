from pyramid.view import view_config


# NOTE: we shouldn't put any permission here since we need to load the index to
# access the login page
@view_config(route_name='index.html', renderer='index.mak')
def index(request):
    return {
        'api_base_path': request.route_path('api')
    }


def includeme(config):
    dev = False
    if dev:
        # Development
        static_path = 'waxe.angular:static'
        config.add_static_view(
            '/bower_components',
            '%s/bower_components' % static_path,
            cache_max_age=3600,
        )
    else:
        static_path = 'waxe.angular:ng-static'

    config.add_route('index.html', '/')

    config.add_static_view(
        '/fonts',
        '%s/fonts' % static_path,
        cache_max_age=3600,
    )

    config.add_static_view(
        '/styles',
        '%s/styles' % static_path,
        cache_max_age=3600,
    )
    config.add_static_view(
        '/views',
        '%s/views' % static_path,
        cache_max_age=3600,
    )
    config.add_static_view(
        '/scripts',
        '%s/scripts' % static_path,
        cache_max_age=3600,
    )
    config.scan(__name__)
