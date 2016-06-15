<!doctype html>
<html ng-app="app">
  <head>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-touch.js"></script>
    <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.4.3/angular-animate.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/csv.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/pdfmake.js"></script>
    <script src="http://ui-grid.info/docs/grunt-scripts/vfs_fonts.js"></script>
    <script src="http://ui-grid.info/release/ui-grid.js"></script>
    <link rel="stylesheet" href="http://ui-grid.info/release/ui-grid.css" type="text/css">
    <link rel="stylesheet" href="/plugins/visualizations/trinotate/static/css/main.css" type="text/css">
  </head>
  <body>

<div ng-controller="MainCtrl">

 <div class="control-group">
         <input  ng-model='filterValue'/><button ng-click='filter()'>Filter</button>

      </div>
  <div ui-grid="gridOptions" ui-grid-pagination ui-grid-expandable class="grid"></div>
</div>

<%doc>
<div ng-controller="SecondCtrl">

 <div class="control-group">
         <input ng-model='filterValue'/><button ng-click='filter()'>Filter</button>

      </div>
  <div ui-grid="gridOptions" ui-grid-pagination ui-grid-expandable class="grid"></div>
</div>
</%doc>





 <script type="text/javascript">
            var hdaId   = '${trans.security.encode_id( hda.id )}'
 </script>
    <script src="/plugins/visualizations/trinotate/static/js/app.js"></script>
  </body>
</html>