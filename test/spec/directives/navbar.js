'use strict';


describe('Directive: menuItem', function () {

    // load the directive's module
    beforeEach(module('waxeApp'));
    beforeEach(module('app/views/navbar.html'));

    var element,
        scope,
        $compile,
        $rootScope,
        $templateCache,
        $location,
        NavbarService;

    beforeEach(inject(function ($injector, _$rootScope_, _$compile_, _$templateCache_, _$location_, _NavbarService_) {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        $templateCache = _$templateCache_;
        $location = _$location_;
        NavbarService = _NavbarService_;
        var $httpBackend = $injector.get('$httpBackend');
        scope = $rootScope.$new();
        $templateCache.get('app/views/navbar.html');
        var html = angular.element($templateCache.get('app/views/navbar.html'));
        var tple = html.find('#navbar-item\\.html').html();
        $templateCache.put('navbar-item.html', tple);

        tple = html.find('#navbar-item-dropdown\\.html').html();
        $templateCache.put('navbar-item-dropdown.html', tple);

        tple = html.find('#navbar-item-group\\.html').html();
        $templateCache.put('navbar-item-group.html', tple);

        // TODO/NOTE: for some reason when making click on 'a' it sends a
        // request after the ng-click is called. It's very strange and seems to
        // be a bug in the tests. In waiting a good solution, just fake the
        // response
         $httpBackend.when('GET', '/api/1/profile.json').respond({});
         $httpBackend.when('GET', 'views/main.html').respond({});
    }));

    it('Test menuItem: navbar-item.html', inject(function () {
        NavbarService.FakeItem = {
            name: 'Fake item',
            iconClass: 'fa fa-fake',
            action: 'NavbarService.fakeAction'
        };
        scope.itemObj = 'FakeItem';
        var cnt = 0;

        NavbarService.fakeAction = function() {
            cnt += 1;
        };

        element = angular.element('<div><menu-item obj="itemObj"></menu-item></div>');
        element = $compile(element)(scope);
        scope.$digest();

        var li = element.find('li');
        expect(li.length).toBe(1);
        expect(li.hasClass('disabled')).toBe(false);
        expect(li.find('a').hasClass('btn-enabled')).toBe(false);
        expect(li.find('i').hasClass('fa fa-fake')).toBe(true);
        expect(li.find('span').text()).toBe('Fake item');

        li.find('a').triggerHandler('click');
        expect(cnt).toBe(1);

        // No click event if item is disabled
        NavbarService.FakeItem.enable = false;
        scope.$digest();
        li.find('a').triggerHandler('click');
        expect(cnt).toBe(1);

        NavbarService.FakeItem.enable = true;
        NavbarService.FakeItem.href = 'UrlFactory.userUrl("fakeurl")';
        scope.$digest();
        spyOn($location, 'path');
        li.find('a').triggerHandler('click');
        expect(cnt).toBe(1);
        expect($location.path).toHaveBeenCalledWith('/fakeurl');

        NavbarService.FakeItem.visible = false;
        scope.$digest();

        li = element.find('li');
        expect(li.length).toBe(0);

        NavbarService.FakeItem.visible = true;
        NavbarService.FakeItem.enable = false;
        scope.$digest();

        li = element.find('li');
        expect(li.length).toBe(1);
        expect(li.hasClass('disabled')).toBe(true);
        expect(li.find('a').hasClass('btn-enabled')).toBe(false);
        expect(li.find('i').hasClass('fa fa-fake')).toBe(true);
        expect(li.find('span').text()).toBe('Fake item');
    }));

    it('Test menuItem: navbar-item-dropdown.html', inject(function () {
        NavbarService.FakeItem = {
            name: 'Fake item',
            iconClass: 'fa fa-fake',
        };

        NavbarService.FakeSubItem = {
            name: 'Fake sub item',
            iconClass: 'fa fa-fake-sub',
        };

        element = angular.element('<div><menu-item obj="itemObj"></menu-item></div>');
        scope.itemObj = {'FakeItem': ['FakeSubItem']};
        element = $compile(element)(scope);
        scope.$digest();

        var lis = element.find('li');
        expect(lis.length).toBe(2);
        expect(lis.eq(0).hasClass('disabled')).toBe(false);
        expect(lis.eq(0).find('> a').hasClass('disabled')).toBe(false);
        expect(lis.eq(0).find('> a').text().trim()).toBe('Fake item');
        expect(lis.eq(1).find('span').text()).toBe('Fake sub item');

        NavbarService.FakeItem.visible = false;
        scope.$digest();

        lis = element.find('li');
        expect(lis.length).toBe(0);

        NavbarService.FakeItem.visible = true;
        NavbarService.FakeItem.enable = false;
        scope.$digest();

        lis = element.find('li');
        expect(lis.eq(0).hasClass('disabled')).toBe(true);
        expect(lis.eq(0).find('> a').hasClass('disabled')).toBe(true);
        expect(lis.eq(0).find('> a').text().trim()).toBe('Fake item');
        expect(lis.eq(1).find('span').text()).toBe('Fake sub item');
    }));

    it('Test menuItem: navbar-item-group.html', inject(function () {
        NavbarService.FakeItem = {
            name: 'Fake item',
            iconClass: 'fa fa-fake',
        };

        NavbarService.FakeSubItem = {
            name: 'Fake sub item',
            iconClass: 'fa fa-fake-sub',
        };

        element = angular.element('<div><menu-item obj="itemObj" sub="true"></menu-item></div>');
        scope.itemObj = {'FakeItem': ['FakeSubItem']};
        element = $compile(element)(scope);
        scope.$digest();

        var lis = element.find('li');
        expect(lis.length).toBe(2);
        expect(lis.eq(0).hasClass('dropdown-header')).toBe(true);
        expect(lis.eq(1).find('span').text()).toBe('Fake sub item');
    }));

    it('Test menuItem: item.template', inject(function () {
        NavbarService.FakeItem = {
            name: 'Fake item',
            iconClass: 'fa fa-fake',
            template: '<span>{{item.name}}</span>'
        };


        element = angular.element('<div><menu-item obj="itemStr"></menu-item></div>');
        scope.itemStr = 'FakeItem';
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.html()).toBe('<span class="ng-binding ng-scope">Fake item</span>');
    }));

    it('Test menuItem: item.templateUrl', inject(function () {
        NavbarService.FakeItem = {
            name: 'Fake item',
            iconClass: 'fa fa-fake',
            templateUrl: 'myitem.html'
        };
        var tple = '<div>{{item.name}}</div>';
        $templateCache.put('myitem.html', tple);

        element = angular.element('<div><menu-item obj="itemStr"></menu-item></div>');
        scope.itemStr = 'FakeItem';
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.html()).toBe('<div class="ng-binding ng-scope">Fake item</div>');
    }));

    it('Test menuItem: divider', inject(function () {
        element = angular.element('<div><menu-item obj="itemStr"></menu-item></div>');
        scope.itemStr = '-';
        element = $compile(element)(scope);
        scope.$digest();

        expect(element.html()).toBe('<li class="divider"></li>');
    }));


});
