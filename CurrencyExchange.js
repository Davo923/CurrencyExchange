var exchangeRate;
var countryCurrencyCode;
function changeExchange(){
  $('.money').html((Cookies.get("igCurrency")*parseFloat($('.money').text().replace("$",""))).toFixed(2)).append(" "+Cookies.get("igCountryCurrencyCode"));
};
$(document).ready(function(){
  if(ig_country != "US"){
    if(!Cookies.get("igCurrency") || !Cookies.get("igCountryCurrencyCode") || (Cookies.get("igCountry") != Cookies.get("igCountryCode"))){
      $.ajax({
          url: 'https://api.iglobalstores.com/1.0/localizationExchange?countryCode='+ig_country,
          type: 'GET',
          dataType: 'JSON',
          headers:{"Accept":"application/json"},
          success: function(data){
          exchangeRate=data[ig_country].rateEstimate;
          countryCurrencyCode=data[ig_country].currency;
          igCountryCode=data[ig_country].code;
          Cookies.set("igCurrency",exchangeRate,{expires:1});
          Cookies.set("igCountryCurrencyCode",countryCurrencyCode,{expires:1});
          Cookies.set("igCountryCode",igCountryCode,{expires:1});
          changeExchange();

          }
          
      });
      }
      else{
          changeExchange();

      }

}});

$(document).on("click",".igWelcomeCTAButton",function(){
window.location.reload();
});
