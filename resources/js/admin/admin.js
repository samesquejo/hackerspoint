import $ from 'jquery';
import dataTable from 'datatables';
import swal from 'sweetalert2';
import Chart from 'chart.js';

export default class Admin {
  constructor (url) {
    this.url = url
  }

  ready () {
    console.log('admin');
    this.initTableOrders();
    this.initLogin();
    this.initInsights();
    this.initCreateItem();
    this.initAppHeaderMenuToggle();
    this.initProducts();
  }

  initTableOrders() {
    // $('#dtOrders').DataTable({
    //   processing : true,
    //   serverSide : true,
    //   responsive : true,
    //   searching : true,
    //   autoWidth : false,
    //   ajax : {
    //     url : $('#dtOrders').data('url'),
    //   },
    //   error : function(returnData){
    //     console.log(returnData);
    //   }
    // });
    $('#dtOrders').DataTable();
  }
  
  initAppHeaderMenuToggle() {
    $('.app-header__menu-toggle').click(function() {
      $(this).toggleClass('open');
      $('.app-sidebar').toggleClass('open');
    });
  }

  initLogin() {
    $('#loginForm').submit(function(){
      var formAction = $(this).attr('action');
      var formData = $(this).serialize();
      $.ajax({
        url : formAction,
        method : 'post',
        data : formData,
      }).done(function(returnData){
        if(returnData.type == 'success'){
          window.location.href = URL+"/admin/dashboard";
        }
        else{
          var message = "";

          if (typeof returnData.message == 'string') {
            message += returnData.message;
          }
          else {
              Object.keys(returnData.message).forEach(function(key) {
                message += '<p>' + returnData.message[key] + '</p>';
              })
          }
          
          swal({
            type: 'error',
            title: 'Oops...',
            html: message,
            confirmButtonColor: '#684AEE',
          })
        }
        // console.log(returnData.length);
      });
      return false;
    });
  }


  scroll (e) {
    const $e = e
    console.log($e);
  }

  initSwal() {
    swal('asd');
  }

  initInsights() {
    // Top Products
    $.ajax({
      url : $('#insights-top-products').attr('data-route'),
      type : 'get',
    }).done(function(returnData){
      var length = !!returnData && !!returnData.item ? returnData.item.length : 0;
      if(length){
        new Chart(document.getElementById('insights-top-products'), {
          type: 'bar',
          data: {
            labels: returnData.item,
            datasets: [
              {
                label: 'Clicks and Views',
                backgroundColor: [
                  '#3e95cd', '#8e5ea2', '#3cba9f', '#e8c3b9', '#c45850'
                ],
                data: returnData.count
              }
            ]
          },
          options: {
            legend: { display: false },
          }
        });
      }
    });

    // Revenue
    $.ajax({
      url : $('#insights-revenue').attr('data-route'),
      type : 'get',
    }).done(function(returnData){
      var length = !!returnData && !!returnData.months ? returnData.months.length : 0;
      if(length){
        new Chart(document.getElementById("insights-revenue"), {
          type: 'line',
          data: {
            labels: returnData.months,
            datasets: [{ 
                data: returnData.counts,
                label: "Revenue",
                borderColor: "#3e95cd",
                fill: true
              }
            ]
          },
        });
      }
    });

  }

  initCreateItem() {
    $('#form-add-item').submit(function(){
      var formAction = $(this).attr('action');
      var formData = new FormData(this);
      var relocation = $(this).attr('data-relocation');
      $.ajax({
        url : formAction,
        data : formData,
        type: "POST",
        contentType: false,
        cache: false,
        processData:false,
      }).done(function(returnData){
        if(returnData.type == 'success'){
          window.location.href = relocation;
        }
        else{
          alert(returnData.message);
        }
      });
      return false;
    });
  }

  initProducts() {
    // Revenue
    $.ajax({
      url : $('#item-list').attr('data-route'),
      type : 'get',
    }).done(function(returnData){
      var length = !!returnData ? returnData.length : 0;
      let toAppend = '';
      if(length){
        $.each(returnData,function(k,v){
          toAppend +=  '<div class="col-xl-4 col-lg-6 col-md-6 mb-3">'+
                          '<div class="hm-media">'+
                              '<div class="hm-media__featured-image">'+
                                  '<img src="'+URL+v.qr_file+'" alt="">'+
                              '</div>'+
                              '<span class="hm-media__label-000">Featured</span>'+
                              '<div class="hm-media__meta">'+
                                  '<span class="hm-media__meta-label-100">'+v.store_name+'</span>'+
                                  '<span class="hm-media__meta-label-101">'+v.item_name+'</span>'+
                                  '<span class="hm-media__meta-label-102">Remaining: '+v.qty+'</span>'+
                                  '<span class="hm-media__meta-label-103">PHP '+v.price+'</span>'+
                              '</div>'+
                          '</div>'+
                      '</div>';
        });

        $('#item-list').append(toAppend);
      }
    });
  }
}
