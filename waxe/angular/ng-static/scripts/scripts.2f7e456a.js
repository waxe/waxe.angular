"use strict";var resolve={loadProfile:["$route","ProfileManager",function(a,b){return b.load(a.current.params.user)}]};angular.module("waxeApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.layout","ui.bootstrap","ui.codemirror","diff-match-patch"]).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:resolve}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/account/:user",{templateUrl:"views/filemanager.html",controller:"FileManagerCtrl",resolve:resolve}).when("/account/:user/search",{templateUrl:"views/search.html",controller:"SearchCtrl",resolve:resolve,reloadOnSearch:!1}).when("/account/:user/versioning",{templateUrl:"views/versioning.html",controller:"VersioningCtrl",resolve:resolve}).when("/account/:user/versioning/update",{templateUrl:"views/versioningupdate.html",controller:"VersioningUpdateCtrl",resolve:resolve}).when("/account/:user/versioning/diff",{templateUrl:"views/versioningdiff.html",controller:"VersioningDiffCtrl",resolve:resolve}).when("/account/:user/txt/edit",{templateUrl:"views/edittxt.html",controller:"EditTxtCtrl",resolve:resolve,editor:!0}).when("/account/:user/:type/edit",{templateUrl:"views/edit.html",controller:"EditCtrl",resolve:resolve,editor:!0}).when("/account/:user/:type/new",{templateUrl:"views/edit.html",controller:"EditCtrl",resolve:resolve,noAutoBreadcrumb:!0}).otherwise({redirectTo:"/"}),b.interceptors.push("HttpInterceptor")}]).run(["$rootScope","Session",function(a,b){window.onbeforeunload=function(a){if(b.form&&b.form.status){a=a||window.event;var c="The file has been updated, are you sure you want to exit?";return a&&(a.returnValue=c),c}}}]),angular.module("waxeApp").controller("MainCtrl",["$scope","$location","UrlFactory","UserProfile","Session",function(a,b,c,d,e){return d.has_file===!0?void b.url(c.userUrl()):(a.Session=e,a.UrlFactory=c,void(a.UserProfile=d))}]),angular.module("waxeApp").controller("LoginCtrl",["$scope","$location","AuthService","UserProfile",function(a,b,c,d){a.UserProfile=d,a.credentials={login:"",password:""},a.login=function(a){c.login(a).then(function(){c.profile().then(function(){var a=b.search().next;b.url("undefined"!=typeof a?a:"/")})})}}]),angular.module("waxeApp").service("AuthService",["$http","$q","UserProfile","AccountProfile","UrlFactory","Session",function(a,b,c,d,e,f){return this.login=function(b){return a.post(e.getAPIUrl("login"),b).then(function(a){c.create(a.data),f.init()})},this.logout=function(){return a.get(e.getAPIUrl("logout")).then(function(){c.destroy(),d.destroy(),f.init()})},this.profile=function(){return a.get(e.getAPIUrl("profile")).then(function(a){c.create(a.data)})},this}]),angular.module("waxeApp").service("ProfileManager",["$q","$http","UserProfile","AccountProfile","UrlFactory","Session",function(a,b,c,d,e,f){this.load=function(g){var h=angular.isDefined(c.login),i=!1;if(angular.isDefined(g)&&d.login!==g&&(i=!0),!i&&h)return angular.isDefined(g)?f.init(d.login,!0):f.init(c.login,!1),a.when(!0);if(i){var j={};return h||(j={full:!0}),b.get(e.urlFor(g,"account-profile.json"),{params:j}).then(function(a){h||c.create(a.data.user_profile),d.create(a.data.account_profile),f.load()})}return b.get(e.getAPIUrl("profile")).then(function(a){c.create(a.data),f.load()})}}]).service("UserProfile",function(){var a=[];this.create=function(b){for(var c in b)a.push(c),this[c]=b[c]},this.destroy=function(){for(var b=0,c=a.length;c>b;b++)delete this[a[b]]}}).service("AccountProfile",function(){var a=[];this.create=function(b){for(var c in b)a.push(c),this[c]=b[c]},this.destroy=function(){for(var b=0,c=a.length;c>b;b++)delete this[a[b]]}}),angular.module("waxeApp").factory("UrlFactory",["Session",function(a){return{getAPIUrl:function(a){return 0!==a.indexOf("/")&&(a="/"+a),a+".json"},getUserAPIUrl:function(a){return this.getAPIUrl(this.userUrl(a))},getActionFromUrl:function(a){var b=a.split("/");return b[b.length-1]},getTypeFromUrl:function(a){var b=a.split("/");return b[b.length-2]},urlFor:function(a,b,c){var d="/account/"+a;return angular.isDefined(b)&&(d+="/"+b),"undefined"!=typeof c&&(d+="?path="+c.path),d},userUrl:function(b,c){return this.urlFor(a.login,b,c)}}}]),angular.module("waxeApp").directive("message",["MessageService",function(a){return{template:'<div class="alert-message alert alert-{{MessageService.type}}" ng-class="MessageService.animation" ng-if="MessageService.message">{{MessageService.message}}<button type="button" class="close" ng-click="MessageService.close()">x</button></div>',restrict:"E",link:function(b){b.MessageService=a}}}]),angular.module("waxeApp").service("MessageService",function(){this.message=null,this.type=null,this.set=function(a,b){this.type=a,this.message=b},this.close=function(){this.message=null}}),angular.module("waxeApp").directive("navbar",["$location","$modal","$http","NavbarService","UserProfile","AccountProfile","AuthService","MessageService","XmlUtils","Utils","UrlFactory","Session","$routeParams",function(a,b,c,d,e,f,g,h,i,j,k,l,m){return{templateUrl:"views/navbar.html",restrict:"E",transclude:!0,replace:!0,link:function(n){n.NavbarService=d,n.UserProfile=e,n.AccountProfile=f,n.UrlFactory=k,n.Session=l,n.logout=function(){g.logout().then(function(){a.path("/login")},function(a){h.set("danger",a.data)})},n.search={text:""},n.doSearch=function(){a.url(k.userUrl("search")).search({search:n.search.text}),n.search.text=""},n.dtd_url=null,n.dtd_tag=null,n.newXmlModal=function(){var c=b.open({templateUrl:"navbar-new.html",controller:["$scope","$modalInstance","parentScope",function(a,b,c){a.dtd_url=c.dtd_url||f.dtd_urls[0],a.updateDtdTags=function(b){a.dtdTags=[],i.getDtdTags(a.dtd_url).then(function(c){a.dtdTags=c,a.dtd_tag=b||a.dtdTags[0]})},a.updateDtdTags(c.dtd_tag),a.ok=function(){b.close({dtd_url:a.dtd_url,dtd_tag:a.dtd_tag}),c.dtd_url=a.dtd_url,c.dtd_tag=a.dtd_tag},a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return n}}});c.result.then(function(b){var c=k.userUrl("xml/new");a.path(c).search(b)})},n.currentXmlTemplatePath=null,n.newXmlTemplateModal=function(){b.open({templateUrl:"navbar-open.html",controller:["$scope","$modalInstance","parentScope",function(a,b,d){a.url="xml/new",a.open=function(b){d.currentXmlTemplatePath=b,a.breadcrumbFiles=j.getBreadcrumbFiles(b,f.templates_path);var e=k.getUserAPIUrl("explore");c.get(e,{params:{path:b}}).then(function(b){a.files=b.data})},a.open(d.currentXmlTemplatePath||f.templates_path),a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return n}}})},n.currentPath=null,n.openModal=function(){b.open({templateUrl:"navbar-open.html",controller:["$scope","$modalInstance","parentScope",function(a,b,d){a.url="xml/edit",a.open=function(b){d.currentPath=b,a.breadcrumbFiles=j.getBreadcrumbFiles(b);var e=k.getUserAPIUrl("explore");c.get(e,{params:{path:b}}).then(function(b){a.files=b.data})},a.open(d.currentPath),a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return n}}})},n.save=function(){var a;return l.submitForm?void l.submitForm():l.form.filename?(a=j.getFormDataForSubmit(l.form.$element),c.post(a.url,a.data).then(function(){l.form&&(l.form.status=null),h.set("success","Saved!")})):void n.saveasModal()},n.saveasModal=function(){var d=b.open({templateUrl:"navbar-saveas.html",controller:["$scope","$modalInstance","parentScope",function(a,b,d){a.folder="",a.filename="",a.createFolder=function(){var b=k.getUserAPIUrl("create-folder");c.post(b,{path:d.currentPath,name:a.folder}).then(function(b){a.open(b.data.link),a.folder=""})},a.saveAs=function(b){if(b=b||a.filename){a.cancel();var c=[];d.currentPath&&c.push(d.currentPath),c.push(b);var e=c.join("/");l.form.setFilename(e),a.save().then(function(){l.setBreadcrumbFiles(e)})}},a.open=function(b){d.currentPath=b,a.breadcrumbFiles=j.getBreadcrumbFiles(b);var e=k.getUserAPIUrl("explore");c.get(e,{params:{path:b}}).then(function(b){a.files=b.data})},a.open(d.currentPath),a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return n}}});d.result.then(function(b){var c=k.userUrl("xml/new");a.path(c).search(b)})},n.sourceToggle=function(){var b=m.source,c=k.getTypeFromUrl(a.path());if("undefined"==typeof b){if("txt"!==c){var d=k.getActionFromUrl(a.path()),e=k.userUrl("txt/"+d),f={path:m.path,source:a.path()};a.path(e).search(f)}}else a.path(b).search({path:m.path})}}}}]),angular.module("waxeApp").service("NavbarService",function(){}),angular.module("waxeApp").factory("HttpInterceptor",["$location","$q","MessageService",function(a,b,c){return{responseError:function(d){return 401===d.status&&"/login"!==a.$$path?(a.url("/login?next="+encodeURIComponent(a.url())),b.reject(d)):(c.set("danger",d.data),b.reject(d))}}}]),angular.module("waxeApp").controller("FileManagerCtrl",["$scope","$http","$routeParams","UrlFactory","UserProfile",function(a,b,c,d,e){var f=d.getUserAPIUrl("explore");b.get(f,{params:c}).then(function(b){a.files=b.data}),a.UrlFactory=d,a.versioning={},e.versioning&&(f=d.getUserAPIUrl("versioning/short-status"),b.get(f,{params:c}).then(function(b){a.versioning=b.data}))}]),angular.module("waxeApp").controller("EditCtrl",["$scope","$http","$sce","$routeParams","$route","$location","UrlFactory","Session",function(a,b,c,d,e,f,g,h){var i=g.getActionFromUrl(f.path()),j=g.getUserAPIUrl(d.type+"/"+i);b.get(j,{params:d}).then(function(b){a.html=c.trustAsHtml(b.data.content),a.treeData=b.data.jstree_data,h.hasForm=!0},function(){var a=g.userUrl("txt/"+i),b=f.path();f.path(a).search({path:d.path,source:b})})}]),angular.module("waxeApp").directive("editor",["Session","$interval",function(a,b){return{template:"<div></div>",restrict:"E",link:function(c,d){var e=c.$watch(function(){d.text()&&(e(),waxe.form=new waxe.Form(c.treeData),a.form=waxe.form)}),f=b(function(){a.form&&a.form.filename&&"updated"===a.form.status&&c.save()},6e4);c.$on("$destroy",function(){if(a.form&&a.form.status){var d=window.confirm("Do you want to save the file before moving?");d&&c.save()}a.form=null,angular.isDefined(f)&&b.cancel(f)})}}}]),angular.module("waxeApp").service("Session",["$http","$q","$route","Utils","UserProfile","AccountProfile",function(a,b,c,d,e,f){this.init=function(a,b){if(this.login=a,this.accountUsable=b,this.currentFile=null,this.user=null,this.breadcrumbFiles=[],this.submitForm=null,this.hasForm=null,this.form=null,this.source=c.current.params.source,this.editor="undefined"!=typeof c.current.$$route.editor,this.showSource=this.editor,this.sourceEnabled=!1,this.editor&&"undefined"!=typeof this.source&&(this.sourceEnabled=!0),this.accountUsable){var d="(new file)";"undefined"==typeof c.current.$$route.noAutoBreadcrumb&&(d=c.current.params.path),this.setBreadcrumbFiles(d)}},this.load=function(){angular.isDefined(f.login)?this.init(f.login,!0):this.init(e.login,!1)},this.setBreadcrumbFiles=function(a){a&&this.currentFile===a||(this.currentFile=a,this.breadcrumbFiles=d.getBreadcrumbFiles(this.currentFile))}}]),angular.module("waxeApp").directive("breadcrumb",["Session","$routeParams","UrlFactory",function(a,b,c){return{template:'<div class="breadcrumb navbar-fixed-top" ng-if="session.breadcrumbFiles.length"><li ng-repeat="file in session.breadcrumbFiles"><a ng-if="isDefined(file.path)" href="#{{UrlFactory.userUrl(\'\', {path: file.path})}}">{{file.name}}</a><span ng-if="!isDefined(file.path)">{{file.name}}</span></li></div>',restrict:"E",replace:!0,link:function(b){b.session=a,b.UrlFactory=c,b.isDefined=angular.isDefined}}}]),angular.module("waxeApp").service("XmlUtils",["$http","$q","UrlFactory",function(a,b,c){this._dtdTags={},this.getDtdTags=function(d){if(d in this._dtdTags){var e=b.defer();return e.resolve(this._dtdTags[d]),e.promise}this._dtdTags[d]=[];var f=this;return a.get(c.getUserAPIUrl("xml/get-tags"),{params:{dtd_url:d}}).then(function(a){return f._dtdTags[d]=a.data,a.data})}}]).service("Utils",function(){this.getFormDataForSubmit=function(a){for(var b={url:a.data("action")},c=a.serializeArray(),d={},e=0,f=c.length;f>e;e++){var g=c[e];d[g.name]=g.value}return b.data=d,b},this.getBreadcrumbFiles=function(a,b){if(b="undefined"!=typeof b?b:"","undefined"==typeof a||""===a||null===a)return[{name:"root"}];if(""!==b&&0===a.indexOf(b)&&(a=a.slice(b.length),0===a.indexOf("/")&&(a=a.slice(1))),""===a)return[{name:"root"}];for(var c=[{name:"root",path:b}],d=a.split("/"),e="",f=0,g=d.length;g>f;f++){f>0&&(e+="/"),e+=d[f];var h={name:d[f]};g-1>f&&(h.path=e),c.push(h)}return c}}),angular.module("waxeApp").controller("SearchCtrl",["$scope","$http","$routeParams","$location","$anchorScroll","$modal","UrlFactory","Utils",function(a,b,c,d,e,f,g,h){a.UrlFactory=g,a.search={search:c.search,page:c.page,path:""},a.totalItems=0,a.itemsPerPage=0,a.maxSize=10,a.results=[],a.doSearch=function(){d.search(a.search);var c=g.getUserAPIUrl("search");b.get(c,{params:a.search}).then(function(b){e(),a.results=b.data.results,a.totalItems=b.data.nb_items,a.itemsPerPage=b.data.items_per_page})},a.newSearch=function(){a.search.page=1,a.doSearch()},a.pageChanged=function(){a.doSearch()},angular.isDefined(a.search.search)&&a.doSearch(),a.currentPath=null,a.folderModal=function(){f.open({templateUrl:"search-folder.html",controller:["$scope","$modalInstance","parentScope",function(a,c,d){a.selectFolder=function(c){d.currentPath=c,a.breadcrumbFiles=h.getBreadcrumbFiles(c);var e=g.getUserAPIUrl("explore");b.get(e,{params:{path:c}}).then(function(b){a.files=b.data})},a.selectFolder(d.currentPath),a.cancel=function(){c.dismiss("cancel")},a.select=function(){d.search.path=d.currentPath,c.close()}}],resolve:{parentScope:function(){return a}}})}}]),angular.module("waxeApp").controller("VersioningCtrl",["$scope","$http","$routeParams","$location","$modal","AccountProfile","UrlFactory","MessageService",function(a,b,c,d,e,f,g,h){!f.has_versioning,a.versioning={};var i=g.getUserAPIUrl("versioning/status");b.get(i,{params:c}).then(function(b){a.versioning=b.data}),a.selectAll=function(a){angular.forEach(a,function(a){a.selected=!0})},a.deselectAll=function(a){angular.forEach(a,function(a){a.selected=!1})},a.doRevert=function(a){for(var c=[],d=[],e=0,f=a.length;f>e;e++){var h=a[e];h.selected===!0&&(c.push(h.relpath),d.push(h))}var i=g.getUserAPIUrl("versioning/revert");b.post(i,{paths:c}).then(function(){angular.forEach(d,function(b){var c=a.indexOf(b);a.splice(c,1)})})},a.doCommit=function(a){var c=e.open({templateUrl:"commit.html",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close({message:a.message})},a.cancel=function(){b.dismiss("cancel")}}]});c.result.then(function(c){for(var d=[],e=[],f=0,i=a.length;i>f;f++){var j=a[f];j.selected===!0&&(d.push(j.relpath),e.push(j))}var k=g.getUserAPIUrl("versioning/commit");b.post(k,{paths:d,msg:c.message}).then(function(b){angular.forEach(e,function(b){var c=a.indexOf(b);a.splice(c,1)}),h.set("success",b.data)})})},a.doDiff=function(a){for(var b=[],c=0,e=a.length;e>c;c++){var f=a[c];f.selected===!0&&b.push(f.relpath)}var h=g.userUrl("versioning/diff");d.path(h).search({paths:b})}}]),angular.module("waxeApp").controller("VersioningDiffCtrl",["$scope","$http","$routeParams","$modal","$compile","UrlFactory","Session","Utils","MessageService",function(a,b,c,d,e,f,g,h,i){var j=f.getUserAPIUrl("versioning/full-diff");b.get(j,{params:c}).then(function(b){a.diffs=b.data.diffs,a.diffOptions={attrs:{insert:{contenteditable:!0}}},a.can_commit=b.data.can_commit,g.submitForm=a.submitForm,g.hasForm=!0}),a.submitForm=function(a){angular.element(".diff").each(function(){var a=angular.element(this),b="";a.contents().each(function(){var a=angular.element(this);a.is("del")||(b+=a.text())}),a.prev("textarea").val(b)});var c=angular.element(".diff-form"),e=h.getFormDataForSubmit(c),g=f.getUserAPIUrl("versioning/update-texts");if(b.post(g,e.data).then(function(a){i.set("success",a.data)}),a===!0&&"undefined"!=typeof e.data){var j=[];for(var k in e.data)k.match(/:filename$/)&&j.push(e.data[k]);var l=d.open({templateUrl:"commit.html",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close({message:a.message})},a.cancel=function(){b.dismiss("cancel")}}]});l.result.then(function(a){var c=f.getUserAPIUrl("versioning/commit");b.post(c,{paths:j,msg:a.message}).then(function(a){i.set("success",a.data)})})}}}]),angular.module("waxeApp").directive("diff",function(){return{template:"<div></div>",restrict:"E",link:function(a,b){var c=a.$watch(function(a){a.html&&(b.html(a.html),c())})}}}),angular.module("waxeApp").controller("VersioningUpdateCtrl",["$scope","$http","UrlFactory",function(a,b,c){a.done=!1;var d=c.getUserAPIUrl("versioning/update");b.get(d).then(function(b){a.files=b.data,a.length=a.files.length,a.done=!0})}]),angular.module("waxeApp").controller("EditTxtCtrl",["$scope","$http","$sce","$routeParams","$route","$location","UrlFactory","Session","MessageService",function(a,b,c,d,e,f,g,h,i){a.editorOptions={lineWrapping:!0,lineNumbers:!0,mode:"xml"},h.hasForm=!0,h.submitForm=function(){var c=g.getUserAPIUrl("txt/update");b.post(c,{path:d.path,filecontent:a.txt}).then(function(){i.set("success","Saved!")})};var j=g.getActionFromUrl(f.path()),k=g.getUserAPIUrl("txt/"+j);b.get(k,{params:d}).then(function(b){a.txt=b.data})}]);