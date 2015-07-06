<!doctype html>
<html class="no-js">
  <head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width">
    <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->
    <link rel="stylesheet" href="styles/vendor.4bccc65f.css">
    <link rel="stylesheet" href="styles/main.a02c79e0.css">

    <script type="text/javascript">
      var API_BASE_PATH = "${api_base_path}";
    </script>

    % for resource in request.css_resources:
      <link rel="stylesheet" type="text/css" href="${request.static_url(resource)}" />
    % endfor

    % for resource in request.str_resources:
      ${resource|n}
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

    <script src="scripts/vendor.199ff4ac.js"></script>

    <script src="scripts/scripts.738ae0df.js"></script>

    % for resource in request.js_resources:
      <script type="text/javascript" src="${request.static_url(resource)}"></script>
    % endfor
  </body>
</html>
