var app = angular.module('app', ['ngTouch', 'ui.grid','ui.grid.expandable', 'ui.grid.pagination']);

app.controller('MainCtrl', [
'$scope', '$http', 'uiGridConstants', function($scope, $http, uiGridConstants) {

  var paginationOptions = {
    pageNumber: 1,
    pageSize: 25,
    sort: null
  };
  var query ={
    baseurl: '/api/datasets/'+hdaId+'?provider=sqlite-dict&data_type=raw_data&query=',
    groupby: '%20group%20by%20gene_id%20',
    genesel: 'select%20t.gene_id,sum(e.frag_count)%20as%20e_count%20from%20expression%20e%20left%20join%20',
    totsel: 'select%20gene_id%20from%20',
    jointable: 'transcript%20t,%20orf%20o,blastdbase%20p,blastdbase%20x%20',
    pfamjoin: 'transcript%20t,%20orf%20o,hmmerdbase%20h%20',
    genewhere: 'and%20e.feature_name=t.gene_id%20',
    joinwhere: 'where%20p.Trinityid=o.orf_id%20and%20t.transcript_id=o.transcript_id%20and%20x.trinityid=t.transcript_id%20',
    pfamwhere: 'where%20t.transcript_id=o.transcript_id%20and%20h.queryprotid=o.orf_id%20',
    group: 'group%20by%20gene_id%20',
    pfamsel: 'select%20t.gene_id,h.pfam_id,h.hmmerdomain%20as%20h_domain,3*(queryendalign-querystartalign)/o.length%20as%20h_qcov,h.fullseqevalue%20as%20h_eval%20from%20',
    //transgroup: 'group%20by%20trans_id%20',
    //orfgroup: 'group%20by%20orf_id%20',
    filter: '',
    sorting: 'order%20by gene_id%20asc%20',
    paging: 'limit%20'+paginationOptions.pageSize+'%20offset%20 '+(paginationOptions.pageNumber - 1) * paginationOptions.pageSize,
    transsel: 'select%20distinct%20t.gene_id,t.transcript_id%20as%20trans_id,length(sequence)%20as%20t_len,x.FullAccession%20as%20x_hit,abs(x.queryend-x.querystart)/o.length%20as%20x_qcov,x.percentidentity%20as%20x_id,x.evalue%20as%20x_eval,x.databasesource%20as%20x_source%20from%20',
    orfsel: 'select%20distinct%20t.gene_id%20as%20gene_id,o.orf_id%20,o.length%20as%20o_len,p.FullAccession%20as%20p_hit,3*abs(p.queryend-p.querystart)/o.length%20as%20p_qcov,p.percentidentity%20as%20p_id,p.evalue%20as%20p_eval,p.databasesource%20as%20p_source%20from%20',
  }

  $scope.gridOptions = {
    enableHorizontalScrollbar: 0,
    enableVerticalScrollbar: 1,
    expandableRowTemplate: '/plugins/visualizations/trinotate/static/threeGridTemplate.html',
    expandableRowHeight: 180,
    //subGridVariable will be available in subGrid scope
    expandableRowScope: {
    subGridVariable: 'subGridScopeVariable'
        },
   // enableFiltering: true,
   // useExternalFiltering: true,
    paginationPageSizes: [25, 50],
    paginationPageSize: 25,
    useExternalPagination: true,
    useExternalSorting: true,
    columnDefs: [
      { name: 'gene_id', enableSorting: false  },
      { name: 'e_count'}
    ],
    onRegisterApi: function(gridApi) {
      $scope.gridApi = gridApi;
/*  
      $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
        if (sortColumns.length == 0) {
          paginationOptions.sort = null;
        } else {
          paginationOptions.sort = sortColumns[0].sort.direction;
        }
        getPage();
      });
*/      
      gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
        paginationOptions.pageNumber = newPage;
        paginationOptions.pageSize = pageSize;
        query.paging='limit%20'+paginationOptions.pageSize+'%20offset%20 '+(paginationOptions.pageNumber - 1) * paginationOptions.pageSize;
        getPage();
      });
   getPage();
    }
  };
  $scope.filter = function() {
     if ($scope.filterValue.length>0){
        query.filter= 'having%20'+$scope.filterValue+'%20';
    }
    else {
        query.filter='';
    } 
    getPage();
    console.log('filtering');
  };
  var unpack = function(url) {
      $http.get(url)
     .success (function(response){ 
        return [].concat.apply([], response.data);
     });
  };
  var getPage = function() {

    var gene_url= query.baseurl + query.genesel +query.jointable +query.joinwhere+ query.genewhere+query.group+query.filter+query.sorting+query.paging;
    var tot_url=  query.totsel +query.jointable +query.joinwhere+ query.group+query.filter;
    var trans_url = query.baseurl + query.transsel +query.jointable +query.joinwhere+'and%20t.gene_id%20in%20('+tot_url+ query.sorting+query.paging+')';
    var orf_url = query.baseurl + query.orfsel +query.jointable +query.joinwhere+'and%20t.gene_id%20in%20('+tot_url+ query.sorting+query.paging+')';
    var pfam_url = query.baseurl + query.pfamsel +query.pfamjoin +query.pfamwhere+'and%20t.gene_id%20in%20('+tot_url+ query.sorting+query.paging+')';
     $http.get(query.baseurl+tot_url)
     .success (function(response){ 
        $scope.gridOptions.totalItems = ([].concat.apply([], response.data)).length;
     });
     $http.get(trans_url)
     .success (function(response){ 
        $scope.transdata = [].concat.apply([], response.data);
     });
    $http.get(orf_url)
     .success (function(response){ 
        $scope.orfdata = [].concat.apply([], response.data);
     });
     $http.get(pfam_url)
     .success (function(response){ 
        $scope.pfamdata = [].concat.apply([], response.data);
     });
     $http.get(gene_url)
     .success (function(response){ 
        $scope.gridOptions.data = [].concat.apply([], response.data);
        for(i = 0; i < $scope.gridOptions.data.length; i++){
        $scope.gridOptions.data[i].subGridOptions1 = {
            enableVerticalScrollbars: 1,
         
          columnDefs: [ {name:"trans_id", field:"trans_id"},{name:"t_len", field:"t_len"},{name:"x_hit", field:"x_hit"},{name:"x_qcov", field:"x_qcov"},
                     ,{name:"x_id", field:"x_id"},{name:"x_eval", field:"x_eval"},{name:"x_source", field:"x_source"} ],
          data: $scope.transdata.filter(function(trans){return trans.gene_id===$scope.gridOptions.data[i].gene_id;})
          }
       //      for(j = 0; j < $scope.gridOptions.data[i].subGridOptions.data.length; j++){  
                       
                 $scope.gridOptions.data[i].subGridOptions2 = {
                     //enableVerticalScrollbars: 0,

                     columnDefs: [ {name:"orf_id", field:"orf_id"},{name:"o_len", field:"o_len"},{name:"p_hit", field:"p_hit"},{name:"p_qcov", field:"p_qcov"},
                     ,{name:"p_id", field:"p_id"},{name:"p_eval", field:"p_eval"},{name:"p_source", field:"p_source"}],
                     data: $scope.orfdata.filter(function(orf){return orf.gene_id===$scope.gridOptions.data[i].gene_id;})
                }
                 $scope.gridOptions.data[i].subGridOptions3 = {
                           //enableVerticalScrollbars: 0,
                     columnDefs: [ {name:"pfam_id", field:"pfam_id"},{name:"h_domain", field:"h_domain"},{name:"h_qcov", field:"h_qcov"},{name:"h_eval", field:"h_eval"} ],
                     data: $scope.pfamdata.filter(function(pfam){return pfam.gene_id===$scope.gridOptions.data[i].gene_id;})
                }

    //         }
          
        }
        
     });    


  };

  getPage();

}

]);