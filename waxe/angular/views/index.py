from pyramid.view import view_config


# NOTE: we shouldn't put any permission here since we need to load the index to
# access the login page
@view_config(route_name='index.html', renderer='index.mak')
def index(request):
    return {
        'api_base_path': request.route_path('api')
    }


def includeme(config):
    settings = config.registry.settings
    if settings.get('waxe.angular.development'):
        settings['mako.directories'] = (
            'waxe.angular:static\n%s' % settings['mako.directories'])
        # Development
        static_path = 'waxe.angular:static'
        config.add_static_view(
            '/bower_components',
            '%s/bower_components' % static_path,
            cache_max_age=3600,
        )
    else:
        settings['mako.directories'] = (
            'waxe.angular:templates\n%s' % settings['mako.directories'])
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
