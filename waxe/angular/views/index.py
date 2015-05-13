from pyramid.view import view_config


@view_config(route_name='index.html', permission='edit', renderer='index.mak')
def index(request):
    return {}


def includeme(config):
    config.add_route('index.html', '/')

    config.add_static_view(
        '/fonts',
        'waxe.angular:ng-static/fonts',
        cache_max_age=3600,
    )

    config.add_static_view(
        '/styles',
        'waxe.angular:ng-static/styles',
        cache_max_age=3600,
    )
    config.add_static_view(
        '/views',
        'waxe.angular:ng-static/views',
        cache_max_age=3600,
    )
    config.add_static_view(
        '/scripts',
        'waxe.angular:ng-static/scripts',
        cache_max_age=3600,
    )
    config.scan(__name__)
