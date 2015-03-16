'use strict';

var app = angular.module('salud_migrante', []);

app.controller('mapa_indicadores_controller', ['$scope', '$rootScope', '$http',
    function($scope, $rootScope, $http) {

        /* Inicializacion de la chingaderas varias */
        $scope.state = {};
        $scope.state.indicators = {};

        $scope.init_map = function() {
            cartodb.createVis("map_canvas", "http://oxcarh.cartodb.com/api/v2/viz/b691f314-cab8-11e4-a0a6-0e4fddd5de28/viz.json")
                .done(function(vis, layers) {
                    console.log("Cargando el Mapa");
                    $scope.vis = vis;
                    $scope.map = $scope.vis.getNativeMap();
                    $scope.layers = layers;

                    var layer0 = $scope.layers[0];
                    var layer1 = $scope.layers[1];

                    layer1.on('featureClick', function(e, pos, latlng, data) {
                        console.log(data);
                        $scope.cartodb_id = data.cartodb_id;
                        $scope.load_state_info($scope.cartodb_id);
                        $scope.load_state_indicators($scope.cartodb_id);
                    });
                })
                .error(function(message) {
                    console.log("No se pudo cargar el mapa");
                });
        };

        $scope.load_state_info = function(cartodb_id) {
            $http.get("http://oxcarh.cartodb.com/api/v2/sql?q=SELECT *, ST_XMin(Box2D(the_geom)) xmin, ST_YMin(Box2D(the_geom)) ymin, ST_XMax(Box2D(the_geom)) xmax, ST_YMax(Box2D(the_geom)) ymax FROM saludmigrante_estados where cartodb_id='" + cartodb_id + "'")
                .success(function(data) {
                    console.log(data);
                    var estado = data.rows[0];
                    $scope.state.name = estado.state_name;
                    $scope.fit_to_bounds(estado.xmin, estado.ymin, estado.xmax, estado.ymax);
                })
                .error(function(data, status) {
                    console.log("Error en load_state_info: " + status);
                    console.log(data);
                });
        };

        $scope.load_state_indicators = function(cartodb_id) {
            $http.get("http://oxcarh.cartodb.com/api/v2/sql?q=SELECT saludmigrante_indicadores.*, saludmigrante_ranking.ralcoholismo, saludmigrante_ranking.rdiabetes, saludmigrante_ranking.rhipertension, saludmigrante_ranking.rtuberculosis, saludmigrante_ranking.robesidad, saludmigrante_ranking.rdepresion, saludmigrante_ranking.rvih FROM saludmigrante_estados, saludmigrante_indicadores, saludmigrante_ranking where saludmigrante_estados.cartodb_id='" + cartodb_id + "' and saludmigrante_estados.state_code=saludmigrante_indicadores.state_code and saludmigrante_estados.state_code=saludmigrante_ranking.state_code")
                .success(function(data) {
                    console.log("Indicators");
                    console.log(data);

                    var indicators = data.rows[0];

                    $scope.state.indicators.alcoholismo = {};
                    $scope.state.indicators.depresion = {};
                    $scope.state.indicators.vih = {};
                    $scope.state.indicators.tuberculosis = {};
                    $scope.state.indicators.diabetes = {};
                    $scope.state.indicators.hipertension = {};
                    $scope.state.indicators.obesidad = {};

                    $scope.state.indicators.alcoholismo.ranking = indicators.ralcoholismo;
                    $scope.state.indicators.alcoholismo.nhis = jQuery.number(indicators.alcoholismo_nhis * 100, 2) + "%";
                    $scope.state.indicators.alcoholismo.llcp = jQuery.number(indicators.alcoholismo_llcp * 100, 2) + "%";
                    $scope.state.indicators.alcoholismo.ensanut = jQuery.number(indicators.alcoholismo_ensanut * 100, 2) + "%";

                    $scope.state.indicators.vih.ranking = indicators.rvih;
                    $scope.state.indicators.vih.cdc = jQuery.number(indicators.vih_cdc * 100, 2) + "%";
                    $scope.state.indicators.vih.censida = jQuery.number(indicators.vih_censida * 100, 2) + "%";

                    $scope.state.indicators.diabetes.ranking = indicators.rdiabetes;
                    $scope.state.indicators.diabetes.nhis = jQuery.number(indicators.diabetes_nhis * 100, 2) + "%";
                    $scope.state.indicators.diabetes.llcp = jQuery.number(indicators.diabetes_llcp * 100, 2) + "%";
                    $scope.state.indicators.diabetes.ensanut = jQuery.number(indicators.diabetes_ensanut * 100, 2) + "%";

                    $scope.state.indicators.hipertension.ranking = indicators.rhipertension;
                    $scope.state.indicators.hipertension.nhis = jQuery.number(indicators.hipertension_nhis * 100, 2) + "%";
                    $scope.state.indicators.hipertension.ensanut = jQuery.number(indicators.hipertension_ensanut * 100, 2) + "%";

                    $scope.state.indicators.tuberculosis.ranking = indicators.rtuberculosis;
                    $scope.state.indicators.tuberculosis.cdc = jQuery.number(indicators.tuberculosis_cdc, 2);
                    $scope.state.indicators.tuberculosis.ensanut = jQuery.number(indicators.tuberculosis_ensanut, 2);

                    $scope.state.indicators.depresion.ranking = indicators.rdepresion;
                    $scope.state.indicators.depresion.nhis = jQuery.number(indicators.depresion_nhis * 100, 2) + "%";
                    $scope.state.indicators.depresion.llcp = jQuery.number(indicators.depresion_llcp * 100, 2) + "%";
                    $scope.state.indicators.depresion.ensanut = jQuery.number(indicators.depresion_ensanut * 100, 2) + "%";

                    $scope.state.indicators.obesidad.ranking = indicators.robesidad;
                    $scope.state.indicators.obesidad.nhis = jQuery.number(indicators.obesidad_nhis * 100, 2) + "%";
                    $scope.state.indicators.obesidad.llcp = jQuery.number(indicators.obesidad_llcp * 100, 2) + "%";
                    $scope.state.indicators.obesidad.ensanut = jQuery.number(indicators.obesidad_ensanut * 100, 2) + "%";

                })
                .error(function(data, status) {
                    console.log("Error en load_state_indicators: " + status);
                    console.log(data);
                });
        };

        $scope.fit_to_bounds = function(xmin, ymin, xmax, ymax) {
            var bounds = [
                [ymin, xmin],
                [ymax, xmax]
            ];
            $scope.map.fitBounds(bounds, {
                padding: [40, 40],
                animate: true
            });
        };

    }
]);
var copistate = "US";
var copiscount = 1;
var copisfrom = "";
copisfrom = copiscount * 10;
$(document).ready(function() {
    function loadCopis(copiscount) {
        var ApiSMExperience = "http://45.56.76.113:8080/indexer/api/copis/experience?state=" + copistate + "&from= " + copisfrom + "&jsoncallback=?";
        jQuery.ajax({url: ApiSMExperience}).done(function(data){
            $.each(data, function (key, data) {
                $.each(data, function (index, data) {
                    data.type = data.type.toLowerCase();
                    data.source = data.source.split("-")[0];
                    $("#hidden-template").tmpl(data).appendTo("#copislist");
                    var ApiSMLearn = "http://45.56.76.113:8080/indexer/api/copis/experience/" + data.id + "/learn?size="
                    jQuery.ajax({url: ApiSMLearn}).done(function(dataLearn){
                        dataLearn = dataLearn._data;
                        var LearnRandom = Math.round(Math.random()*14);
                        jQuery('p#copi-min-l-'+data.id).append(dataLearn[LearnRandom].text);
                    })
                    var ApiSMChange = "http://45.56.76.113:8080/indexer/api/copis/experience/" + data.id + "/change?from=0&size=1";
                    jQuery.ajax({url: ApiSMChange}).done(function(dataChange){
                        dataChange = dataChange._data;
                        var changeRandom = Math.round(Math.random()*3);
                        jQuery('p#copi-min-r-'+data.id).append(dataChange[changeRandom].text);
                    })
                })
            })
        })
    }
loadCopis(copiscount);
// loadcopis
$("#loadcopis").on('click', function() {
    copiscount++;
    copisfrom = copiscount * 10;
    loadCopis(copiscount);
});
});
