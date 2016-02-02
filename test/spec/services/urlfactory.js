'use strict';

describe('Service: UrlFactory', function () {

  var UrlFactory, Session;

  // load the service's module
  beforeEach(module('waxeApp'));

  // instantiate service
  beforeEach(inject(function (_UrlFactory_, _Session_) {
    UrlFactory = _UrlFactory_;
    Session = _Session_;
  }));

  it('UrlFactory._generateUrl', function () {
    var res;
    res = UrlFactory._generateUrl('username');
    expect(res).toBe('/account/username');

    res = UrlFactory._generateUrl('username', 'mypath');
    expect(res).toBe('/account/username/mypath');

    res = UrlFactory._generateUrl(
            'username', 'mypath',
            {'param1': 'value1', 'param2': 'value2', 'bool': true});
    expect(res).toBe('/account/username/mypath?param1=value1&param2=value2&bool=true');

    res = UrlFactory._generateUrl(
            'username', 'mypath',
            {'param1': ['value1', 'value2']});
    expect(res).toBe('/account/username/mypath?param1=value1&param1=value2');

    res = UrlFactory._generateUrl(
            'username', 'mypath',
            undefined, 'myhash');
    expect(res).toBe('/account/username/mypath#myhash');

    res = UrlFactory._generateUrl(
            'username', 'mypath',
            {'param1': ['value1', 'value2']},
            'myhash');
    expect(res).toBe('/account/username/mypath?param1=value1&param1=value2#myhash');
  });

  it('UrlFactory._generateUserUrl', function () {
    Session.login = 'mylogin';
    var res;
    res = UrlFactory._generateUserUrl(
            'mypath',
            {'param1': 'value1', 'param2': 'value2'});
    expect(res).toBe('/account/mylogin/mypath?param1=value1&param2=value2');
  });

  it('UrlFactory.url', function () {
    var res;
    res = UrlFactory.url(
            'username', 'mypath',
            {'param1': 'value1', 'param2': 'value2'});
    expect(res).toBe('/account/username/mypath?param1=value1&param2=value2');
  });

  it('UrlFactory.url', function () {
    var res;
    res = UrlFactory.url(
            null, 'mypath',
            {'param1': 'value1', 'param2': 'value2'});
    expect(res).toBe('/mypath?param1=value1&param2=value2');
  });

  it('UrlFactory._generateAPIUrl', function () {
    var res;
    res = UrlFactory._generateAPIUrl('mypath');
    expect(res).toBe('/api/1/mypath');
  });

  it('UrlFactory.APIUrl', function () {
    var res;
    res = UrlFactory.APIUrl('username', 'mypath');
    expect(res).toBe('/api/1/account/username/mypath');

    res = UrlFactory.APIUrl('username', 'mypath', {'param1': 'value1'});
    expect(res).toBe('/api/1/account/username/mypath?param1=value1');
  });

  it('UrlFactory.APIUserUrl', function () {
    Session.login = 'mylogin';
    var res;
    res = UrlFactory.APIUserUrl('mypath');
    expect(res).toBe('/api/1/account/mylogin/mypath');
  });

  it('UrlFactory.jsonAPIUrl', function () {
    var res;
    res = UrlFactory.jsonAPIUrl('username', 'mypath');
    expect(res).toBe('/api/1/account/username/mypath.json');

    res = UrlFactory.jsonAPIUrl('username', 'mypath', {'param1': 'value1'});
    expect(res).toBe('/api/1/account/username/mypath.json?param1=value1');
  });

  it('UrlFactory.jsonAPIUserUrl', function () {
    Session.login = 'mylogin';
    var res;
    res = UrlFactory.jsonAPIUserUrl('mypath');
    expect(res).toBe('/api/1/account/mylogin/mypath.json');

    res = UrlFactory.jsonAPIUserUrl('mypath', {'param1': 'value1'});
    expect(res).toBe('/api/1/account/mylogin/mypath.json?param1=value1');
  });
});
