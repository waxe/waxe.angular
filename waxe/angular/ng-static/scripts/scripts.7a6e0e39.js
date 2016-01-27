"use strict";var resolve={loadProfile:["$route","$interval","ProfileManager","Session","FileUtils",function(a,b,c,d,e){if(null!==d.autosave_interval&&(b.cancel(d.autosave_interval),d.autosave_interval=null),d.form&&d.form.status){var f=window.confirm("Do you want to save the file before moving?");f&&e.save()}return d.form=null,c.load(a.current.params.user)}]};angular.module("waxeApp",["ngAnimate","ngAria","ngCookies","ngMessages","ngResource","ngRoute","ngSanitize","ngTouch","ui.layout","ui.bootstrap","ui.codemirror","diff-match-patch"]).config(["$routeProvider","$httpProvider",function(a,b){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:resolve}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl"}).when("/account/:user",{templateUrl:"views/filemanager.html",controller:"FileManagerCtrl",resolve:resolve}).when("/account/:user/search",{templateUrl:"views/search.html",controller:"SearchCtrl",resolve:resolve}).when("/account/:user/versioning",{templateUrl:"views/versioning.html",controller:"VersioningCtrl",resolve:resolve}).when("/account/:user/versioning/update",{templateUrl:"views/versioningupdate.html",controller:"VersioningUpdateCtrl",resolve:resolve}).when("/account/:user/versioning/diff",{templateUrl:"views/versioningdiff.html",controller:"VersioningDiffCtrl",resolve:resolve}).when("/account/:user/versioning/unified-diff",{templateUrl:"views/versioningunifieddiff.html",controller:"VersioningUnifiedDiffCtrl",resolve:resolve,diff:!0}).when("/account/:user/txt/edit",{templateUrl:"views/edittxt.html",controller:"EditTxtCtrl",resolve:resolve,editor:!0,type:"txt",action:"edit"}).when("/account/:user/:type/edit",{templateUrl:"views/edit.html",controller:"EditCtrl",resolve:resolve,editor:!0,type:"xml",action:"edit"}).when("/account/:user/:type/new",{templateUrl:"views/edit.html",controller:"EditCtrl",resolve:resolve,noAutoBreadcrumb:!0,type:"xml",action:"new"}).otherwise({redirectTo:"/"}),b.interceptors.push("HttpInterceptor")}]).run(["$rootScope","Session","MessageService",function(a,b,c){a.$on("$routeChangeStart",function(a,b,d){angular.isDefined(d)&&(angular.isDefined(d.$$route.editor)&&d.$$route.editor===b.$$route.editor||c.close()),c.setIfEmpty("loading","Loading...","info")}),a.$on("$routeChangeError",function(){c.close("loading")}),a.$on("pageLoaded",function(a){a.targetScope.pageLoaded=!0,c.setIfEmptyOrSameType("loading","Loaded","info",1e3)}),window.onbeforeunload=function(a){if(b.form&&b.form.status){a=a||window.event;var c="The file has been updated, are you sure you want to exit?";return a&&(a.returnValue=c),c}}}]),angular.module("waxeApp").controller("MainCtrl",["$scope","$location","UrlFactory","UserProfile","Session","File",function(a,b,c,d,e){var f=b.search(),g=b.hash();if(d.has_file===!0){var h=c.userUrl("",f,g);return void b.url(h)}a.Session=e,a.UrlFactory=c,a.UserProfile=d,a.qs=f,a.hash=g,a.$emit("pageLoaded")}]),angular.module("waxeApp").controller("LoginCtrl",["$scope","$location","AuthService","UserProfile",function(a,b,c,d){a.$emit("pageLoaded"),a.UserProfile=d,a.credentials={login:"",password:""},a.login=function(a){c.login(a).then(function(){c.profile().then(function(){var a=b.search().next;b.url("undefined"!=typeof a?a:"/")})})}}]),angular.module("waxeApp").service("AuthService",["$http","$q","UserProfile","AccountProfile","UrlFactory","Session",function(a,b,c,d,e,f){return this.login=function(b){return a.post(e.jsonAPIUrl(null,"login"),b).then(function(a){c.create(a.data),f.init()})},this.logout=function(){return a.get(e.jsonAPIUrl(null,"logout")).then(function(){c.destroy(),d.destroy(),f.init()})},this.profile=function(){return a.get(e.jsonAPIUrl(null,"profile")).then(function(a){c.create(a.data)})},this}]),angular.module("waxeApp").service("ProfileManager",["$q","$http","UserProfile","AccountProfile","UrlFactory","Session",function(a,b,c,d,e,f){this.load=function(g){var h=angular.isDefined(c.login),i=!1;if(angular.isDefined(g)&&d.login!==g&&(i=!0),!i&&h)return angular.isDefined(g)?f.init(d.login,!0):f.init(c.login,!1),a.when(!0);if(i){var j={};return h||(j={full:!0}),b.get(e.jsonAPIUrl(g,"account-profile"),{params:j}).then(function(a){h||c.create(a.data.user_profile),d.create(a.data.account_profile),f.load()})}return b.get(e.jsonAPIUrl(null,"profile")).then(function(a){c.create(a.data),f.load()})}}]).service("UserProfile",function(){var a=[];this.create=function(b){for(var c in b)a.push(c),this[c]=b[c]},this.destroy=function(){for(var b=0,c=a.length;c>b;b++)delete this[a[b]]}}).service("AccountProfile",function(){var a=[];this.create=function(b){for(var c in b)a.push(c),this[c]=b[c]},this.destroy=function(){for(var b=0,c=a.length;c>b;b++)delete this[a[b]]}}),angular.module("waxeApp").factory("UrlFactory",["Session",function(a){var b="/api/1";return"undefined"!=typeof API_BASE_PATH&&(b=API_BASE_PATH),{_generateUrl:function(a,b,c,d){var e="";if(a&&(e="/account/"+a),angular.isDefined(b)&&(e+="/"+b),angular.isDefined(c)){var f=[];angular.forEach(c,function(a,b){"string"==typeof a&&(a=[a]),angular.forEach(a,function(a){f.push(b+"="+encodeURIComponent(a))})}),e+="?"+f.join("&")}return angular.isDefined(d)&&d&&(e+="#"+d),e},_generateUserUrl:function(){var b=[];return b.push(a.login),b.push.apply(b,arguments),this._generateUrl.apply(this,b)},url:function(){return this._generateUrl.apply(this,arguments)},userUrl:function(){return this._generateUserUrl.apply(this,arguments)},_generateAPIUrl:function(a){var c=b;return 0!==a.indexOf("/")&&(c+="/"),c+a},APIUrl:function(){var a=this._generateUrl.apply(this,arguments);return this._generateAPIUrl(a)},APIUserUrl:function(){var a=this._generateUserUrl.apply(this,arguments);return this._generateAPIUrl(a)},jsonAPIUrl:function(){arguments[1]+=".json";var a=this._generateUrl.apply(this,arguments);return this._generateAPIUrl(a)},jsonAPIUserUrl:function(){arguments[0]+=".json";var a=this._generateUserUrl.apply(this,arguments);return this._generateAPIUrl(a)}}}]),angular.module("waxeApp").directive("message",["MessageService",function(a){return{template:'<div class="alert-message alert alert-{{MessageService.classname}}" ng-class="MessageService.animation" ng-if="MessageService.message">{{MessageService.message}}<button type="button" class="close" ng-click="MessageService.close()">x</button></div>',restrict:"E",link:function(b,c){b.MessageService=a,b.$watch(function(){if(b.MessageService.message){var a=c.children().eq(0),d=($("body").width()-a.outerWidth())/2;a.css({left:d+"px"})}})}}}]),angular.module("waxeApp").service("MessageService",["$timeout",function(a){this.message=null,this.type=null,this.timer=null,this.set=function(b,c,d,e){this.timer&&a.cancel(this.timer),this.type=b,this.message=c,this.classname=angular.isDefined(d)?d:this.type;var f=angular.isDefined(e)?e:3e3;if("success"===this.type||angular.isDefined(e)){var g=this;this.timer=a(function(){g.close()},f)}},this.setIfEmpty=function(a,b,c,d){return this.message?!1:void this.set(a,b,c,d)},this.setIfEmptyOrSameType=function(a,b,c,d){return this.message&&a!==this.type?!1:void this.set(a,b,c,d)},this.close=function(a){return angular.isDefined(a)&&a!==this.type?!1:void(this.message=null)}}]),angular.module("waxeApp").controller("BaseModalCtrl",["$scope","$modalInstance","Session","Folder","Files","Utils",function(a,b,c,d,e,f){a.sessionAttr=a.sessionAttr||"currentPath",a.openFolder=function(b){c[a.sessionAttr]=b,a.breadcrumbFiles=f.getBreadcrumbFiles(b),e.query(b).then(function(b){a.files=b})},a.openFile=function(a){b.close(a)},a.open=function(b){b instanceof d?a.openFolder(b.path):a.openFile(b)},a.cancel=function(){b.dismiss("cancel")},a.getPath=function(){return c[a.sessionAttr]},a.openFolder(c[a.sessionAttr]||a.defaultPath)}]).directive("navbar",["$location","$modal","$http","NavbarService","UserProfile","AccountProfile","AuthService","MessageService","XmlUtils","Utils","FileUtils","UrlFactory","Session","$routeParams","$route","Files","Folder","File",function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r){return{templateUrl:"views/navbar.html",restrict:"E",transclude:!0,replace:!0,link:function(j){j.NavbarService=d,j.UserProfile=e,j.AccountProfile=f,j.UrlFactory=l,j.Session=m,j.FileUtils=k,j.logout=function(){g.logout().then(function(){a.path("/login")},function(a){h.set("danger",a.data)})},j.search={text:""},j.doSearch=function(){a.url(l.userUrl("search")).search({search:j.search.text}),j.search.text=""},j.doRender=function(){if(null!==m.filename){var a=r.loadFromPath(m.filename);window.open(a.viewUrl,"_viewer")}else{for(var b,c=m.filesSelected,d=+new Date,e=0,f=c.length;f>e;e++)b=c[e].viewUrl,window.open(b,"_viewer_"+d+"-"+e);m.unSelectFiles()}},j.dtd_url=null,j.dtd_tag=null,j.newXmlModal=function(){var c=b.open({templateUrl:"navbar-new.html",controller:["$scope","$modalInstance","parentScope",function(a,b,c){a.dtd_url=c.dtd_url||f.dtd_urls[0],a.updateDtdTags=function(b){a.dtdTags=[],i.getDtdTags(a.dtd_url).then(function(c){a.dtdTags=c,a.dtd_tag=b||a.dtdTags[0]})},a.updateDtdTags(c.dtd_tag),a.ok=function(){b.close({dtd_url:a.dtd_url,dtd_tag:a.dtd_tag}),c.dtd_url=a.dtd_url,c.dtd_tag=a.dtd_tag},a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return j}}});c.result.then(function(b){var c=a.$$absUrl,d=l.userUrl("xml/new");a.path(d).search(b),c===a.$$absUrl&&o.reload()})};var p=function(a,c,d,e,f){return function(){var g=b.open({templateUrl:a,controller:["$scope","$modalInstance","$controller",function(a,b,d){a.title=c,a.sessionAttr=e,a.defaultPath=f,d("BaseModalCtrl",{$scope:a,$modalInstance:b})}]});return g.result.then(d),g}};j.newXmlTemplateModal=p("navbar-open-modal.html","New from template",function(b){a.url(b.newUrl)},"currentXmlTemplatePath",f.templates_path),j.openModal=p("navbar-open-modal.html","Open file",function(b){a.url(b.editUrl)},"currentPath"),j.sourceToggle=function(){var b=n.from,c=o.current.$$route.type;if("undefined"==typeof b||"source"!==n.fromtype){if("txt"!==c){var d=l.userUrl("txt/edit"),e={path:n.path,from:b||a.path(),fromtype:"source"};a.path(d).search(e)}}else a.path(b).search({path:n.path})},j.diffToggle=function(){var b=n.from;if("undefined"==typeof b||"diff"!==n.fromtype){var c=l.userUrl("versioning/unified-diff"),d={path:n.path,from:b||a.path(),fromtype:"diff"};a.path(c).search(d)}else a.path(b).search({path:n.path})},j.showDiff=function(){var b=l.userUrl("versioning/unified-diff"),c={path:n.path};a.path(b).search(c)},j.completion={path:""},j.getPaths=function(a){var b=l.jsonAPIUserUrl("search/path-complete");return c.get(b,{params:{search:a}}).then(function(a){return a.data})},j.openFile=function(b){j.completion.path="";var c=r.loadFromPath(b);a.url(c.editUrl)}}}}]).directive("menuItem",["$compile","$templateRequest","$sce","$animate","$parse","$location","NavbarService","FileUtils","UrlFactory","UserProfile","AccountProfile","Session",function(a,b,c,d,e,f,g,h,i,j,k,l){return{restrict:"E",scope:{obj:"=",sub:"@",icon:"="},link:function(c,d){c.NavbarService=g,c.FileUtils=h,c.UrlFactory=i,c.AccountProfile=k,c.Session=l,c.UserProfile=j;var m,n;if("string"==typeof c.obj?(m=c.obj,n=[]):(m=Object.keys(c.obj)[0],n=c.obj[m]),"-"===m)return void d.replaceWith('<li class="divider"></li>');var o=g[m];if(angular.isDefined(o.enable)&&"string"==typeof o.enable){var p=o.enable;o.enable=e(p)(c),c.$watch(p,function(a,b){a!==b&&(o.enable=a)})}if(c.clickItem=function(){if(o.enable===!1)return!1;if(angular.isDefined(o.confirmMsg)&&!window.confirm(o.confirmMsg))return!1;if(o.href){var a=e(o.href)(c);return f.url(a)}e(o.action)(c)()},o.template)c.item=o,a(o.template)(c,function(a){d.replaceWith(a)});else if(o.templateUrl)b(o.templateUrl).then(function(b){c.item=o,a(b.trim())(c,function(a){d.replaceWith(a)})});else if(n.length){var q;q=c.sub?"navbar-item-group.html":"navbar-item-dropdown.html",b(q).then(function(b){c.item=o,c.children=n,a(b.trim())(c,function(a){d.replaceWith(a)})})}else b("navbar-item.html").then(function(b){c.item=o,a(b.trim())(c,function(a){d.replaceWith(a)})})}}}]),angular.module("waxeApp").service("NavbarService",["AccountProfile",function(a){this.File={name:"File",enable:!1},this.New={name:"New"},this.NewXML={name:"XML",iconClass:"fa fa-file-o",action:"$root.newXmlModal"},this.NewXMLFromTemplate={name:"XML <small>(from template)</small>",visible:!1,iconClass:"fa fa-file-o",action:"$root.newXmlTemplateModal"},this.Open={name:"Open",iconClass:"fa fa-folder-open-o",action:"$root.openModal"},this.Save={name:"Save",enable:!1,iconClass:"fa fa-save",action:"FileUtils.save"},this.SaveAs={name:"Save as",enable:!1,iconClass:"fa fa-save",action:"FileUtils.saveasModal"},this.Versioning={name:"Versioning",enable:!1,visible:!1},this.Status={name:"Status",iconClass:"fa fa-info",href:'UrlFactory.userUrl("versioning/")'},this.Update={name:"Update",iconClass:"fa fa-exchange",href:'UrlFactory.userUrl("versioning/update/")'},this.Rendering={name:"Rendering",enable:"Session.filesSelected.length != 0 || Session.filename !== null",visible:!1,iconClass:"fa fa-eye",action:"$root.doRender"},this.Search={name:"Advanced search",enable:!1,visible:!1,href:'UrlFactory.userUrl("search")'},this.SearchForm={enable:!1,visible:!1,templateUrl:"navbar-item-search.html"},this.Login={templateUrl:"navbar-item-login.html"},this.Source={name:"Source",enable:!1,visible:!1,selected:!1,action:"$root.sourceToggle"},this.Diff={name:"Diff",enable:!1,visible:!1,selected:!1,action:"$root.diffToggle"},this.Delete={name:"Delete",enable:"Session.filesSelected.length != 0",iconClass:"fa fa-remove",action:"FileUtils.deleteFiles",confirmMsg:"Are you sure you want to delete the selected files"},this.Move={name:"Move",enable:"Session.filesSelected.length != 0",iconClass:"fa fa-exchange",action:"FileUtils.moveFile"},this.OpenSelected={name:"Open selected files",enable:"Session.filesSelected.length != 0",iconClass:"fa fa-arrow-circle-o-up",action:"FileUtils.openNewWindow"},this.enable=function(a){this.File.enable=a,this.Versioning.enable=a,this.Search.enable=a},this.setVisible=function(b){b?(this.NewXMLFromTemplate.visible=a.has_template_files,this.Versioning.visible=a.has_versioning,this.Rendering.visible=a.has_xml_renderer,this.Search.visible=a.has_search,this.SearchForm.visible=a.has_search,this.Source.visible=!0,this.Diff.visible=a.has_versioning,this.NewXML.visible=!0,this.Open.visible=!0,this.Save.visible=!0):(this.NewXMLFromTemplate.visible=!1,this.Versioning.visible=!1,this.Rendering.visible=!1,this.Search.visible=!1,this.SearchForm.visible=!1,this.Source.visible=!1,this.Diff.visible=!1,this.NewXML.visible=!1,this.Open.visible=!1,this.Save.visible=!1),this.Source.selected=!1,this.Diff.selected=!1},this.setEditFile=function(a,b){this.Save.enable=a,this.SaveAs.enable=a,this.Diff.enable=a,this.Source.enable=b},this.menuData=[[{File:[{New:["NewXML","NewXMLFromTemplate"]},"-","Open","Save","SaveAs"]},{Versioning:["Status","Update"]},"SearchForm","Search"],["Login"],["NewXML","Open","Save","-","Delete","Move","OpenSelected","Rendering"],["Source","Diff"]]}]),angular.module("waxeApp").factory("HttpInterceptor",["$location","$q","MessageService",function(a,b,c){return{responseError:function(d){return 401===d.status&&"/login"!==a.$$path?(a.url("/login?next="+encodeURIComponent(a.url())),b.reject(d)):(-1===[301,302].indexOf(d.status)&&c.set("danger",d.data),b.reject(d))}}}]),angular.module("waxeApp").controller("FileManagerCtrl",["$scope","$http","$routeParams","$location","UrlFactory","AccountProfile","UserProfile","Session","Files","File",function(a,b,c,d,e,f,g,h,i,j){var k=d.search().search,l=d.hash();if(angular.isDefined(k)){var m=e.userUrl("search",d.search());return void d.url(m).hash(l)}if(i.query(c.path).then(function(b){a.files=h.files=b,a.$emit("pageLoaded")},function(a){if(302===a.status){var b=j.loadFromPath(c.path);return void d.url(b.editUrl).hash(l)}}),a.UrlFactory=e,a.UserProfile=g,a.versioning={},f.has_versioning){var m=e.jsonAPIUserUrl("versioning/short-status");b.get(m,{params:c}).then(function(b){a.versioning=b.data,angular.forEach(a.files,function(b){b.status=a.versioning[b.path]})})}a.opened_files=[],a.commited_files=[],m=e.jsonAPIUrl(null,"last-files"),b.get(m).then(function(b){a.opened_files=i.dataToObjs(b.data.opened_files),a.commited_files=i.dataToObjs(b.data.commited_files)})}]),angular.module("waxeApp").controller("EditCtrl",["$scope","$http","$sce","$routeParams","$route","$location","$compile","UrlFactory","Session","NavbarService",function(a,b,c,d,e,f,g,h,i,j){a.xml_filters="undefined"!=typeof XML_FILTERS?XML_FILTERS:null;var k=e.current.$$route.action,l=h.jsonAPIUserUrl(d.type+"/"+k);b.get(l,{params:d}).then(function(b){a.html=b.data.content,a.treeData=b.data.jstree_data,i.filename=d.path,j.setEditFile(!0,!0),a.$emit("pageLoaded")},function(){var a=h.userUrl("txt/"+k),b=f.path();f.path(a).search({path:d.path,from:b,fromtype:"source"})}),a.external_current=-1,a.external_values=[],a.closeExternalEditor=function(){a.showExternalEditor=!1};var m,n,o=angular.element(".external-editor");o.bind("dragstart",function(a){m=a.originalEvent.clientX,n=a.originalEvent.clientY}),o.bind("dragend",function(a){var b=a.originalEvent.clientX,c=a.originalEvent.clientY,d=o.position(),e=d.left,f=d.top,g=e-(m-b),h=f-(n-c);o.css({left:g,top:h,right:"auto",bottom:"auto"})}),a.externalResetSizeAndPosition=function(){o.removeAttr("style").find(".modal-content").removeAttr("style")},a.externalEditor=function(b){var c=angular.element(b).parent().attr("id"),d=angular.element(xmltool.utils.escapeAttr("#"+c)).find("textarea:not(._comment):first");a.$apply(function(){a.externalIsContenteditable=!1;var b;d.is(":visible")?b=function(){return d.val.apply(d,arguments)}:(d=d.next(),a.externalIsContenteditable=!0,b=function(){return d.html.apply(d,arguments)});var c=b();a.external_values.push(c),a.externalElt=d,a.external_current++,d.attr("ng-model","external_values["+a.external_current+"]"),b(""),g(d)(a),b(c),a.showExternalEditor=!0})},a.scrollToElement=function(){xmltool.utils.scrollToElement(a.externalElt,angular.element("#xml-editor-form-container")),a.externalElt.focus()}}]),angular.module("waxeApp").directive("editor",["$interval","$anchorScroll","$location","Session","FileUtils",function($interval,$anchorScroll,$location,Session,FileUtils){return{template:"<div></div>",restrict:"E",scope:{html:"="},link:function postLink(scope,element){element.append(scope.html);var listener=scope.$watch(function(){element.text()&&($anchorScroll($location.hash()),listener(),waxe.form=new waxe.Form(scope.$parent.treeData),Session.form=waxe.form,angular.element(document).on("click",".btn-external-editor",function(){eval("scope.$parent."+angular.element(this).attr("ng-click"))}))});Session.autosave_interval=$interval(function(){Session.form&&Session.form.filename&&"updated"===Session.form.status&&FileUtils.save()},1e4)}}}]).directive("xmlfilters",[function(){return{template:'<div class="btn-group pull-right" ng-class="cssClass"><button class="btn btn-default btn-xs" ng-class="{\'active\': filter.active}" title="{{filter.title}}" ng-click="toggle(filter)" ng-repeat="filter in filters">{{filter.name}}</button></div>',restrict:"E",scope:{filters:"="},link:function(a,b){var c,d=0,e=function(a,b){b?(c.addClass("xml-filter-"+a),d+=1):(c.removeClass("xml-filter-"+a),d-=1),d>0?c.addClass("xml-filters"):c.removeClass("xml-filters")};if(null!==a.filters)var f=a.$watch(function(){c=angular.element(".layout-container"),c.length&&angular.isDefined(a.filters)&&(f(),b.addClass("has-xml-filters"),angular.forEach(a.filters,function(a){a.active&&e(a.name,!0)}))});a.toggle=function(a){a.active=!a.active,e(a.name,a.active)}}}}]),angular.module("waxeApp").service("Session",["$http","$q","$route","Utils","UserProfile","AccountProfile","NavbarService",function(a,b,c,d,e,f,g){this.currentPath=null,this.files=[],this.filesSelected=[],this.autosave_interval=null,this.init=function(a,b){if(this.login=a,this.accountUsable=b,this.currentFile=null,this.user=null,this.breadcrumbFiles=[],this.files=[],this.filesSelected=[],this.submitForm=null,this.filename=null,this.form=null,this.from=c.current.params.from,this.editor="undefined"!=typeof c.current.$$route.editor,this.diff="undefined"!=typeof c.current.$$route.diff,this.showSource=this.editor||this.diff,this.sourceEnabled=!1,this.editor&&"undefined"!=typeof this.from&&(this.sourceEnabled=!0),this.showDiff=f.has_versioning&&(this.diff||this.editor),this.diffEnabled=!1,this.diff&&"undefined"!=typeof this.from&&(this.diffEnabled=!0),g.enable(this.accountUsable),g.setVisible(this.accountUsable),g.setEditFile(!1,!1),this.accountUsable){var d="(new file)";"undefined"==typeof c.current.$$route.noAutoBreadcrumb&&(d=c.current.params.path),this.setBreadcrumbFiles(d)}},this.load=function(){angular.isDefined(f.login)?this.init(f.login,!0):this.init(e.login,!1)},this.unSelectFiles=function(){for(var a=0,b=this.filesSelected.length;b>a;a++)this.filesSelected[a].selected=!1;this.filesSelected=[]},this.setBreadcrumbFiles=function(a){a&&this.currentFile===a||(this.currentFile=a,this.breadcrumbFiles=d.getBreadcrumbFiles(this.currentFile))},this.setFilename=function(a){this.filename=a,this.setBreadcrumbFiles(a)}}]),angular.module("waxeApp").directive("breadcrumb",["$location",function(a){return{template:'<ul class="breadcrumb"><li ng-repeat="file in files"><a ng-if="!$last || ($last && $first)" href="" ng-click="open(file)">{{file.name}}</a><span ng-if="$last && !$first">{{file.name}}</span></li></ul>',restrict:"E",replace:!0,scope:{files:"=",action:"&"},controller:["$scope","$element","$attrs",function(b,c,d){b.open=function(c){angular.isDefined(d.action)?b.action()(c):a.url(c.editUrl)}}]}}]),angular.module("waxeApp").service("XmlUtils",["$http","$q","UrlFactory",function(a,b,c){this._dtdTags={},this.getDtdTags=function(d,e){if(e="undefined"==typeof e?!1:e,e in this._dtdTags||(this._dtdTags[e]={}),d in this._dtdTags[e]){var f=b.defer();return f.resolve(this._dtdTags[e][d]),f.promise}this._dtdTags[e][d]=[];var g=this,h={dtd_url:d};return e&&(h.text=e),a.get(c.jsonAPIUserUrl("xml/get-tags"),{params:h}).then(function(a){return g._dtdTags[e][d]=a.data,a.data})}}]).service("Utils",["$injector",function(a){var b;this.getFormDataForSubmit=function(a){for(var b={url:a.data("action")},c=a.serializeArray(),d={},e=0,f=c.length;f>e;e++){var g=c[e];d[g.name]=g.value.replace(/\r/g,"")}return b.data=d,b},this.getBreadcrumbFiles=function(c,d){if(b||(b=a.get("Folder")),d="undefined"!=typeof d?d:"",""!==d&&0===c.indexOf(d)&&(c=c.slice(d.length),0===c.indexOf("/")&&(c=c.slice(1))),"undefined"==typeof c||""===c||null===c)return[new b({name:"root",path:d})];for(var e=[new b({name:"root",path:d})],f=c.split("/"),g="",h=0,i=f.length;i>h;h++){h>0&&(g+="/"),g+=f[h];var j=new b({name:f[h],path:g});e.push(j)}return e}}]).service("FileUtils",["$http","$location","$modal","Session","MessageService","UrlFactory","Utils","Files",function(a,b,c,d,e,f,g,h){var i=this;this.save=function(){if(d.submitForm)return void d.submitForm();if(!d.form.filename)return void i.saveasModal();var b=g.getFormDataForSubmit(d.form.$element);return a.post(b.url,b.data).then(function(){d.form&&(d.form.status=null),e.set("success","Saved!")})},this.saveasModal=function(){var b=c.open({templateUrl:"navbar-saveas.html",controller:["$scope","$modalInstance","$controller","Folder",function(b,c,e,g){e("BaseModalCtrl",{$scope:b,$modalInstance:c}),b.folder="",b.filename="",b.showCreateFolder=!1,b.createFolder=function(){var c=f.jsonAPIUserUrl("create-folder");a.post(c,{path:d.currentPath,name:b.folder}).then(function(a){b.open(new g(a.data)),b.folder="",b.showCreateFolder=!1})},b.openFile=function(a){b.filename=a.name,angular.element(".modal-filename").focus()},b.saveAs=function(){var a=b.filename;if(a){var d=!0;return angular.forEach(b.files,function(b){return b.name!==a||window.confirm("Are you sure you want to replace the existing file?")?void 0:(d=!1,!1)}),d?void c.close(a):!1}}}]});b.result.then(function(a){var b=[];d.currentPath&&b.push(d.currentPath),b.push(a);var c=b.join("/");d.form.setFilename(c),i.save().then(function(){d.setFilename(c)})})},this.moveFile=function(){var a=c.open({templateUrl:"file-move.html",controller:["$scope","$modalInstance",function(a,b){a.folder="",a.filename="",a.open=function(b){d.currentPath=b,a.breadcrumbFiles=g.getBreadcrumbFiles(b),h.query(b).then(function(b){a.files=b})},a.open(d.currentPath),a.cancel=function(){b.dismiss("cancel")},a.ok=function(){b.close({directory:d.currentPath})}}]});a.result.then(function(a){var b=d.filesSelected;h.move(b,a.directory)})},this.openNewWindow=function(){for(var a,b=d.filesSelected,c=+new Date,e=0,f=b.length;f>e;e++)a=b[e].editUrl,window.open("#"+a,c+"-"+e);d.unSelectFiles()},this.deleteFiles=function(){var a=d.filesSelected;h["delete"](a)}}]),angular.module("waxeApp").controller("SearchCtrl",["$scope","$http","$routeParams","$location","$anchorScroll","$modal","UrlFactory","Utils","XmlUtils","AccountProfile","Files","File",function(a,b,c,d,e,f,g,h,i,j,k){a.UrlFactory=g,a.filetypes=[{text:"Select a filetype (optional)",value:""},{text:"xml",value:".xml"}],a.search={search:c.search,page:c.page,path:c.path,tag:c.tag,filetype:".xml",open:c.open},a.totalItems=0,a.itemsPerPage=0,a.maxSize=10,a.results=[],a.doSearch=function(){d.search(a.search);var c=g.jsonAPIUserUrl("search/search");b.get(c,{params:a.search}).then(function(b){e();var c=k.dataToObjs(b.data.results);return a.search.open&&1===b.data.nb_items?void d.url(c[0].editUrl):(a.results=c,a.totalItems=b.data.nb_items,a.itemsPerPage=b.data.items_per_page,void a.$emit("pageLoaded"))})},a.newSearch=function(){a.search.page=1,a.doSearch()},a.pageChanged=function(){a.doSearch()},angular.isDefined(a.search.search)&&a.doSearch(),a.currentPath=null,a.folderModal=function(){f.open({templateUrl:"search-folder.html",controller:["$scope","$modalInstance","$controller","parentScope",function(a,b,c,d){c("BaseModalCtrl",{$scope:a,$modalInstance:b}),a.select=function(){d.search.path=a.getPath(),b.close()}}],resolve:{parentScope:function(){return a}}})},a.dtd_tag=null,a.tagModal=function(){var b=f.open({templateUrl:"tag-modal.html",controller:["$scope","$modalInstance","parentScope",function(a,b,c){a.dtd_url=c.dtd_url||j.dtd_urls[0],a.updateDtdTags=function(b){a.dtdTags=[],i.getDtdTags(a.dtd_url,!0).then(function(c){a.dtdTags=c,a.dtd_tag=b||a.dtdTags[0]})},a.updateDtdTags(c.dtd_tag),a.ok=function(){b.close({dtd_url:a.dtd_url,dtd_tag:a.dtd_tag}),c.dtd_url=a.dtd_url,c.dtd_tag=a.dtd_tag},a.cancel=function(){b.dismiss("cancel")}}],resolve:{parentScope:function(){return a}}});b.result.then(function(b){a.search.tag=b.dtd_tag})}}]),angular.module("waxeApp").controller("VersioningCtrl",["$scope","$http","$routeParams","$location","$modal","AccountProfile","UrlFactory","MessageService","Files",function(a,b,c,d,e,f,g,h,i){!f.has_versioning;var j=function(){for(var b in a.versioning)if(a.versioning[b].length)return;a.emptyPage=!0};a.versioning={};var k=g.jsonAPIUserUrl("versioning/status");b.get(k,{params:c}).then(function(b){a.versioning={},a.versioning.conflicteds=i.dataToObjs(b.data.conflicteds),a.versioning.uncommitables=i.dataToObjs(b.data.uncommitables),a.versioning.others=i.dataToObjs(b.data.others),a.$emit("pageLoaded"),j()}),a.selectAll=function(a){angular.forEach(a,function(a){a.selected=!0})},a.deselectAll=function(a){angular.forEach(a,function(a){a.selected=!1})};var l=function(a){for(var b=0,c=a.length;c>b;b++)if(a[b].selected)return!0;return!1};a.doRevert=function(a){if(!l(a))return h.set("warning","Please select at least one file",void 0,1e3),!1;for(var c=[],d=[],e=0,f=a.length;f>e;e++){var i=a[e];i.selected===!0&&(c.push(i.relpath),d.push(i))}var k=g.jsonAPIUserUrl("versioning/revert");b.post(k,{paths:c}).then(function(b){angular.forEach(d,function(c){var d=a.indexOf(c);a.splice(d,1),h.set("success",b.data)}),j()})},a.doCommit=function(a){if(!l(a))return h.set("warning","Please select at least one file",void 0,1e3),!1;var c=e.open({templateUrl:"commit.html",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close({message:a.message})},a.cancel=function(){b.dismiss("cancel")}}]});c.result.then(function(c){for(var d=[],e=[],f=0,i=a.length;i>f;f++){var k=a[f];k.selected===!0&&(d.push(k.relpath),e.push(k))}var l=g.jsonAPIUserUrl("versioning/commit");b.post(l,{paths:d,msg:c.message}).then(function(b){angular.forEach(e,function(b){var c=a.indexOf(b);a.splice(c,1)}),h.set("success",b.data),j()})})},a.doDiff=function(a){if(!l(a))return h.set("warning","Please select at least one file",void 0,1e3),!1;for(var b=[],c=0,e=a.length;e>c;c++){var f=a[c];f.selected===!0&&b.push(f.relpath)}var i=g.userUrl("versioning/diff");d.path(i).search({paths:b})}}]),angular.module("waxeApp").controller("VersioningDiffCtrl",["$scope","$http","$routeParams","$modal","$compile","$location","$interval","UrlFactory","Session","Utils","MessageService","NavbarService","File",function(a,b,c,d,e,f,g,h,i,j,k,l,m){var n=h.jsonAPIUserUrl("versioning/full-diff");b.get(n,{params:c}).then(function(b){a.diffs=b.data.diffs,angular.forEach(a.diffs,function(a){var b=m.loadFromPath(a.relpath);a.url=b.editUrl}),a.diffOptions={attrs:{insert:{contenteditable:!0},equal:{contenteditable:!0}}},a.can_commit=b.data.can_commit,i.submitForm=a.submitForm,l.Save.enable=!0,a.$emit("pageLoaded")}),i.autosave_interval=g(function(){a.submitForm()},3e4),a.submitForm=function(a){angular.element(".diff").each(function(){var a=angular.element(this),b="";a.contents().each(function(){var a=angular.element(this);a.is("del")||(b+=a.text())}),a.prev("textarea").val(b)});var c=angular.element(".diff-form"),e=j.getFormDataForSubmit(c),g=h.jsonAPIUserUrl("txt/updates");if(b.post(g,e.data).then(function(a){k.set("success",a.data)}),a===!0&&"undefined"!=typeof e.data){var i=[];for(var l in e.data)l.match(/:filename$/)&&i.push(e.data[l]);var m=d.open({templateUrl:"commit.html",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close({message:a.message})},a.cancel=function(){b.dismiss("cancel")}}]});m.result.then(function(a){var c=h.jsonAPIUserUrl("versioning/commit");k.set("commit","Commit in progress..."),b.post(c,{paths:i,msg:a.message}).then(function(a){k.set("success",a.data),f.url(h.userUrl("versioning/"))})})}}}]),angular.module("waxeApp").directive("diff",function(){return{template:"<div></div>",restrict:"E",link:function(a,b){var c=a.$watch(function(a){a.html&&(b.html(a.html),c())})}}}),angular.module("waxeApp").controller("VersioningUpdateCtrl",["$scope","$http","UrlFactory","MessageService","Files",function(a,b,c,d,e){var f=c.jsonAPIUserUrl("versioning/update");b.get(f).then(function(b){a.files=e.dataToObjs(b.data),a.length=a.files.length,a.$emit("pageLoaded")})}]),angular.module("waxeApp").controller("EditTxtCtrl",["$scope","$http","$sce","$routeParams","$route","$location","UrlFactory","Session","MessageService","NavbarService",function(a,b,c,d,e,f,g,h,i,j){a.editorOptions={lineWrapping:!0,lineNumbers:!0,mode:"xml"},h.submitForm=function(){var c=g.jsonAPIUserUrl("txt/update"),e={path:d.path,filecontent:a.txt},h=f.search().conflicted;angular.isDefined(h)&&(e.conflicted=h),b.post(c,e).then(function(){i.set("success","Saved!")})};var k=e.current.$$route.action,l=g.jsonAPIUserUrl("txt/"+k);b.get(l,{params:d}).then(function(b){a.txt=b.data,h.filename=d.path;var c=angular.isDefined(d.from);j.setEditFile(!0,c),c&&(j.Source.selected=!0),a.$emit("pageLoaded")})}]),angular.module("waxeApp").controller("VersioningUnifiedDiffCtrl",["$scope","$http","$routeParams","$modal","UrlFactory","MessageService","NavbarService",function(a,b,c,d,e,f,g){var h=e.jsonAPIUserUrl("versioning/diff");b.get(h,{params:c}).then(function(b){a.ok=angular.isDefined(b.data.diff)?!0:!1,a.diff=b.data.diff,a.can_commit=b.data.can_commit,g.Diff.enable=!0,g.Diff.selected=!0,a.$emit("pageLoaded")}),a.doCommit=function(){var g=d.open({templateUrl:"commit.html",controller:["$scope","$modalInstance",function(a,b){a.ok=function(){b.close({message:a.message})},a.cancel=function(){b.dismiss("cancel")
}}]});g.result.then(function(d){var g=[c.path],h=e.jsonAPIUserUrl("versioning/commit");b.post(h,{paths:g,msg:d.message}).then(function(b){f.set("success",b.data),a.ok=!1})})},a.doRevert=function(){var d=e.jsonAPIUserUrl("versioning/revert"),g=[c.path];b.post(d,{paths:g}).then(function(b){f.set("success",b.data),a.ok=!1})}}]),angular.module("waxeApp").directive("contenteditable",["$sce",function(a){return{restrict:"A",require:"?ngModel",link:function(b,c,d,e){function f(){var a=c.html();d.stripBr&&"<br>"==a&&(a=""),e.$setViewValue(a)}e&&(e.$render=function(){c.html(a.getTrustedHtml(e.$viewValue||""))},c.on("blur keyup change",function(){b.$evalAsync(f)}))}}}]),angular.module("waxeApp").directive("ngConfirmClick",function(){return{priority:1,terminal:!0,restrict:"A",link:function(a,b,c){var d=c.ngConfirmClick||"Are you sure?",e=c.ngClick;b.bind("click",function(){window.confirm(d)&&a.$eval(e)})}}}),angular.module("waxeApp").directive("useraccount",["Session","UserProfile",function(a,b){return{template:'<div class="container alert-useraccount alert alert-warning" ng-if="Session.login != UserProfile.login">You are working on the account of <strong>{{Session.login}}</strong></div>',restrict:"E",replace:!0,link:function(c){c.Session=a,c.UserProfile=b}}}]),angular.module("waxeApp").directive("file",["$location","$parse","UrlFactory","Session",function(a,b,c,d){return{template:'<div ng-class="containerClass"><input ng-if="checkbox" type="checkbox" ng-model="file.selected" class="file-checkbox" /><a href="" ng-click="click()"><i ng-class="file.iClass"></i>{{name}}</a></div>',restrict:"E",scope:{file:"=data"},require:"^files",link:function(c,e,f,g){c.name=angular.isDefined(g.display)?b(g.display)(c):c.file.name,c.checkbox=g.checkbox,c.click=function(){return angular.isDefined(g.action)?g.action()(c.file):void a.url(c.file.editUrl)},c.$watch("file.selected",function(a,b){a!==b&&(a===!0?(d.filesSelected.push(c.file),c.containerClass="file-selected"):(d.filesSelected.splice(d.filesSelected.indexOf(c.file),1),c.containerClass=""))})}}}]),angular.module("waxeApp").directive("files",function(){return{template:'<div ng-if="checkbox"> Select: <a href="" ng-click="selectAll()">All</a> / <a href="" ng-click="deselectAll()">None</a><br /></div><div class="col-md-{{colMd}}" ng-repeat="file in files" ng-if="showFile(file)" ng-class="\'versioning-\' + file.status"><file data="file" selected="selected"></file></div>',restrict:"E",scope:{files:"=data",checkbox:"@",action:"&",display:"@",col:"@",folder:"="},controller:["$scope","$element","$attrs",function(a,b,c){a.colMd=angular.isDefined(c.col)?12/a.col:6,a.showFile=function(b){return a.folder===!0&&"folder"!==b.type?!1:!0},angular.isDefined(c.action)&&(this.action=a.action),angular.isDefined(c.display)&&(this.display=c.display),this.checkbox=a.checkbox||!1,a.selectAll=function(){angular.forEach(a.files,function(a){a.selected=!0})},a.deselectAll=function(){angular.forEach(a.files,function(a){a.selected=!1})}}]}}),angular.module("waxeApp").factory("FS",function(){var a=function(a){this.init(a)};return a.prototype.init=function(a){this.status=!1,this.selected=!1;for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b])},a.prototype._editUrl=function(){throw new Error("NotImplemented")},Object.defineProperty(a.prototype,"editUrl",{get:function(){return this._editUrl()}}),a}).factory("Folder",["FS","UrlFactory",function(a,b){var c=function(a){this.init(a),this.iClass="fa fa-folder-o"};return c.prototype=new a,c.prototype._editUrl=function(){return b.userUrl("",{path:this.path})},c}]).factory("File",["FS","UrlFactory","AccountProfile",function(a,b,c){var d=function(a){this.init(a),this.iClass="fa fa-file-excel-o"};return d.prototype=new a,d.prototype._editUrl=function(a){var c=this.editor+"/edit";return a=a||{},a.path=this.path,angular.isDefined(this.user)&&this.user?b.url(this.user,c,a):b.userUrl(c,a)},d.prototype.init=function(b){a.prototype.init.call(this,b),angular.isDefined(this.name)||(this.name=this.path.substring(this.path.lastIndexOf("/")+1,this.path.length)),this.extension=this.name.substring(this.name.lastIndexOf("."),this.name.length).toLowerCase(),this.editor=c.editors[this.extension],this.renderer=c.renderers[this.extension]},Object.defineProperty(d.prototype,"newUrl",{get:function(){var a=this.editor+"/new";return b.userUrl(a,{path:this.path})}}),Object.defineProperty(d.prototype,"viewUrl",{get:function(){var a=this.renderer+"/view";return b.jsonAPIUserUrl(a,{path:this.path})}}),d.loadFromPath=function(a){var b={name:a.substring(a.lastIndexOf("/")+1,a.length),path:a};return new d(b)},d}]).service("Files",["$http","$q","UrlFactory","MessageService","Session","Folder","File",function(a,b,c,d,e,f,g){var h=this,i=function(a){for(var b=[],c=0,d=a.length;d>c;c++)b.push(a[c].path);return b},j=function(c,d,e){return a[c](d,{params:{path:e}}).then(function(a){return angular.isDefined(a)&&angular.isDefined(a.data)?h.dataToObjs(a.data):b.reject(a)})};this.dataToObjs=function(a){return a.map(function(a){return"folder"===a.type?new f(a):new g(a)})},this.query=function(a){var b=c.jsonAPIUserUrl("explore");return j("get",b,a)},this.move=function(b,f){var g=c.jsonAPIUserUrl("files/move");return a.post(g,{paths:i(b),newpath:f}).then(function(){angular.forEach(b,function(a){var b=e.files.indexOf(a);e.files.splice(b,1)}),e.unSelectFiles(),d.set("success","Files moved!")})},this["delete"]=function(b){var f=i(b),g=c.jsonAPIUserUrl("files",{paths:f});return a["delete"](g).then(function(){angular.forEach(b,function(a){var b=e.files.indexOf(a);e.files.splice(b,1)}),e.unSelectFiles(),d.set("success","Files deleted!")})}}]);