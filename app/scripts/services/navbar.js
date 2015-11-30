'use strict';

/**
 * @ngdoc service
 * @name waxeApp.Navbar
 * @description
 * # Navbar
 * Service in the waxeApp.
 */
angular.module('waxeApp')
    .service('NavbarService', ['AccountProfile', function (AccountProfile) {

        this.File = {
            name: 'File',
            enable: false,
        };

        this.New = {
            name: 'New',
        };

        this.NewXML = {
            name : 'XML',
            iconClass: 'fa fa-file-o',
            action: '$root.newXmlModal'
        };

        this.NewXMLFromTemplate = {
            name: 'XML <small>(from template)</small>',
            visible: false,
            iconClass: 'fa fa-file-o',
            action: '$root.newXmlTemplateModal'
        };

        this.Open = {
            name: 'Open',
            iconClass: 'fa fa-folder-open-o',
            action: '$root.openModal'
        };

        this.Save = {
            name: 'Save',
            enable: false,
            iconClass: 'fa fa-save',
            action: 'FileUtils.save'
        };

        this.SaveAs = {
            name: 'Save as',
            enable: false,
            iconClass: 'fa fa-save',
            action: 'FileUtils.saveasModal'
        };

        this.Versioning = {
            name: 'Versioning',
            enable: false,
            visible: false,
        };

        this.Status = {
            name: 'Status',
            iconClass: 'fa fa-info',
            href: 'UrlFactory.userUrl("versioning/")'
        };

        this.Update = {
            name: 'Update',
            iconClass: 'fa fa-exchange',
            href: 'UrlFactory.userUrl("versioning/update/")'
        };

        this.Rendering = {
            name: 'Rendering',
            enable: false,
            visible: false,
            action: '$root.doRender'
        };

        this.Search = {
            enable: false,
            visible: false,
            templateUrl: 'navbar-item-search.html'
        };

        this.Login = {
            templateUrl: 'navbar-item-login.html'
        };

        this.Source = {
            name: 'Source',
            enable: false,
            visible: false,
            selected: false,
            action: '$root.sourceToggle'
        };

        this.Diff = {
            name: 'Diff',
            enable: false,
            visible: false,
            selected: false,
            action: '$root.diffToggle'
        };

        this.Delete = {
            name: 'Delete',
            enable: 'Session.filesSelected.length != 0',
            iconClass: 'fa fa-remove',
            action: 'FileUtils.deleteFiles'
        };

        this.Move = {
            name: 'Move',
            enable: 'Session.filesSelected.length != 0',
            iconClass: 'fa fa-exchange',
            action: 'FileUtils.moveFile'
        };

        this.OpenSelected = {
            name: 'Open selected files',
            enable: 'Session.filesSelected.length != 0',
            iconClass: 'fa fa-arrow-circle-o-up',
            action: 'FileUtils.openNewWindow'
        };

        this.enable = function(value) {
            this.File.enable = value;
            this.Versioning.enable = value;
            this.Search.enable = value;
        };

        this.setVisible = function(accountUsable) {
            if (accountUsable) {
                this.NewXMLFromTemplate.visible = AccountProfile.has_template_files;
                this.Versioning.visible = AccountProfile.has_versioning;
                this.Rendering.visible = AccountProfile.has_xml_renderer;
                this.Search.visible = AccountProfile.has_search;
                this.Source.visible = true;
                this.Diff.visible = AccountProfile.has_versioning;
                this.NewXML.visible = true;
                this.Open.visible = true;
                this.Save.visible = true;
            }
            else {
                this.NewXMLFromTemplate.visible = false;
                this.Versioning.visible = false;
                this.Rendering.visible = false;
                this.Search.visible = false;
                this.Source.visible = false;
                this.Diff.visible = false;
                this.NewXML.visible = false;
                this.Open.visible = false;
                this.Save.visible = false;
            }
            this.Source.selected = false;
            this.Diff.selected = false;
        };

        this.setEditFile = function(value, source) {
            this.Save.enable = value;
            this.SaveAs.enable = value;
            this.Rendering.enable = value;
            this.Diff.enable = value;
            this.Source.enable = source;
        };

        this.menuData = [
            [
                {'File': [{'New': ['NewXML', 'NewXMLFromTemplate']}, '-', 'Open', 'Save', 'SaveAs']},
                {'Versioning': ['Status', 'Update']},
                'Rendering',
                'Search'
            ],
            ['Login'],
            ['NewXML', 'Open', 'Save', '-', 'Delete', 'Move', 'OpenSelected'],
            ['Source', 'Diff']
        ];
    }]
);
