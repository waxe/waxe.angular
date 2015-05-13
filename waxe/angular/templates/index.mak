<!doctype html>
<html class="no-js">
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="styles/vendor.4bccc65f.css">
    <link rel="stylesheet" href="styles/main.d1302ad0.css">

    <link rel="stylesheet" type="text/css" href="http://127.0.0.1:6543/static-core/css/waxe.min.css" />
    <link rel="stylesheet" type="text/css" href="http://127.0.0.1:6543/static-xml/xmltool.min.css" />
    <link rel="stylesheet" type="text/css" href="http://127.0.0.1:6543/static-xml/themes/default/style.min.css" />

    % for resource in request.css_resources:
      <link rel="stylesheet" type="text/css" href="${request.static_url(resource)}" />
    % endfor

  </head>
  <body ng-app="waxeApp">
    <!--[if lt IE 7]>
      <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->

    <!-- Add your site or application content here -->
    <message></message>
    <navbar></navbar>
    <breadcrumb></breadcrumb>
    <div class="container container-autoscroll">
      <div ng-view=""></div>
    </div>

    <!-- Google Analytics: change UA-XXXXX-X to be your site's ID -->
     <script>
       !function(A,n,g,u,l,a,r){A.GoogleAnalyticsObject=l,A[l]=A[l]||function(){
       (A[l].q=A[l].q||[]).push(arguments)},A[l].l=+new Date,a=n.createElement(g),
       r=n.getElementsByTagName(g)[0],a.src=u,r.parentNode.insertBefore(a,r)
       }(window,document,'script','//www.google-analytics.com/analytics.js','ga');

       ga('create', 'UA-XXXXX-X');
       ga('send', 'pageview');
    </script>

    <script src="scripts/vendor.9d20c879.js"></script>

    <script src="scripts/scripts.2f7e456a.js"></script>

    <script type="text/javascript" src="http://127.0.0.1:6543/static-core/js/waxe.js"></script>
    <script type="text/javascript" src="http://127.0.0.1:6543/static-xml/jstree.min.js"></script>
    <script type="text/javascript" src="http://127.0.0.1:6543/static-xml/xmltool.js"></script>

    % for resource in request.js_resources:
      <script type="text/javascript" src="${request.static_url(resource)}"></script>
    % endfor
  </body>
</html>
