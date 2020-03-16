<template>
  <div>
    <naver-maps
      :height="height"
      :width="width"
      :mapOptions="mapOptions"
      :initLayers="initLayers"
      @load="onLoad"
      @drag="drag"
    >
      <!-- <naver-circle :lat="37" :lng="127" :radius="88600"/>
      <naver-rectangle :south="36" :north="38" :west="126" :east="128"/>
      <naver-ellipse :bounds="{south:36,north:38,west:126,east:128}"/>
      <naver-polygon :paths="[[{lat:37,lng:127},{lat:38,lng:127},{lat:38,lng:129},{lat:37,lng:128}]]"/>
      <naver-polyline :path="[{lat:37,lng:127},{lat:38,lng:129}]"/>
      <naver-ground-overlay
        :url="'//logoproject.naver.com/img/img_about.gif'"
      :bounds="{south:36.7,north:36.9,west:126.5,east:127.5}"/>-->
    </naver-maps>
    <!-- <p>
      {{user_location}}
    </p>-->
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      x: 37,
      y: 127,
      width: 600,
      height: 600,
      info: null,
      marker: null,
      markers: [],
      count: 1,
      map: null,
      isCTT: false,
      mapOptions: {
        lat: 37,
        lng: 127,
        zoom: 16,
        zoomControl: true,
        zoomControlOptions: { position: "TOP_RIGHT" },
        mapTypeControl: true
      },
      initLayers: [
        "BACKGROUND",
        "BACKGROUND_DETAIL",
        "POI_KOREAN",
        "TRANSIT",
        "ENGLISH"
      ]
    };
  },
  computed: {
    // user_location () {
    //   if(this.map)
    //   return this.map.getCenter();
    //   else
    //   return (37,127)
    // }
  },
  methods: {
    refresh() {
      if (this.markers != null && this.markers.length > 0) {
        $.each(this.markers, function(i, m) {
          m.m.setZIndex(0);
        });
      }
    },
    dateChange(s) {
      String.prototype.string = function(len) {
        var s = "",
          i = 0;
        while (i++ < len) {
          s += this;
        }
        return s;
      };
      String.prototype.zf = function(len) {
        return "0".string(len - this.length) + this;
      };
      Number.prototype.zf = function(len) {
        return this.toString().zf(len);
      };
      if (s == null) {
        return "정보 없음";
      } else {
        var d = new Date(s);
        return `${(d.getMonth() + 1).zf(2)}. ${d
          .getDate()
          .zf(2)} ${d.getHours().zf(2)}:${d.getMinutes().zf(2)}`;
      }
    },
    removeAll() {
      this.markers.forEach((v, i) => {
        // recognizer.remove(v);
        // console.log(v)
        v.m.setMap(null);
      });
      this.markers = [];
    },
    reSearch() {
      // console.log(new naver.maps.LatLng(this.map.getCenter()));
      var th = this;
      this.removeAll();
      var url =
        "https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByGeo/json?lat=" +
        this.x +
        "&lng=" +
        this.y +
        "&m=1000";
      axios
        .get(url, {})
        .then(res => {
          this.markers = res.data.stores;
          this.markers.forEach((v, i) => {
            //marker
            var marker = new naver.maps.Marker({
              position: new naver.maps.LatLng(v.lat, v.lng),
              map: window.$naverMapsObject,
              icon: {
                url: require("../assets/img/" + v.remain_stat + ".png"),
                size: new naver.maps.Size(50, 23),
                scaledSize: new naver.maps.Size(50, 23)
                //origin: new naver.maps.Point(0, 0),
                //anchor: new naver.maps.Point(25, 26)
              }
            });
            //infowindow
            var contentString = [
              '<div class="iw_inner" style = "padding: 5px 5px 5px 5px">',
              "   <h3>" + v.name + "</h3>",
              " <p style = 'margin-bottom : 3px'> " + v.addr + "</p>",
              "   <p style = 'overflow : hidden; margin : 3px 0; vertical-align : middle'>",
              "      마스크 수량 : <img src= " +
                require("../assets/img/text_" + v.remain_stat + ".png") +
                ' style = "vertical-align:middle; width :18%"> </p>',
              "<p style = 'overflow : hidden; margin : 3px 0;'>업데이트 : " +
                this.dateChange(v.created_at) +
                " | 입고시간 : " +
                this.dateChange(v.stock_at) +
                "</p>",
              "</div>"
            ].join("");

            var infowindow = new naver.maps.InfoWindow({
              content: contentString
            });
            naver.maps.Event.addListener(marker, "click", async function(e) {
              th.info = infowindow;
              //marker 초기화
              if (infowindow.getMap()) {
                infowindow.close();
              } else {
                infowindow.open(window.$naverMapsObject, marker);
              }

              th.refresh();
              marker.setZIndex(3);
            });
            this.markers[i]["m"] = marker;
          });
        })
        .catch(e => {});
    },
    drag() {
      $("#btnReSearch").css("display", "inline-block");
    },
    onLoad(vue) {
      this.map = vue;
      var th = this;
      if (navigator.geolocation) {
        // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(
          position => {
            this.x = position.coords.latitude;
            this.y = position.coords.longitude;
            console.log(this.x, this.y);
            this.map.setCenter(new naver.maps.LatLng(this.x, this.y));
            this.reSearch();
            //https://shin-jaeheon.github.io/vue-naver-maps/#/kr/naver-marker
          },
          function(error) {
            console.error(error);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity
          }
        );
      } else {
        alert("GPS를 지원하지 않습니다");
      }

      naver.maps.Event.addListener(
        window.$naverMapsObject,
        "dragend",
        function() {
          th.drag();
        }
      );
      var reSearchBtnHtml =
        '<button type="button" id="btnReSearch" style= "display:none;background-color: #ed1b2e;color: #fff;justify-content: center; pointer-events: auto;max-width: 200px;padding: 2px 10px 1px;font-size: 12px;line-height: 25px;letter-spacing: -.7px;text-align: left;white-space: nowrap;border: 0;margin-top: 10px;"><span>주변 약국 재검색</span></button>';
      naver.maps.Event.once(
        window.$naverMapsObject,
        "init_stylemap",
        function() {
          //customControl 객체 이용하기
          var $reSearchBtn = $(reSearchBtnHtml),
            reSearchBtnEl = $reSearchBtn[0];
          window.$naverMapsObject.controls[naver.maps.Position.TOP_CENTER].push(
            reSearchBtnEl
          );
          naver.maps.Event.addDOMListener(reSearchBtnEl, "click", function() {
            var xy = window.$naverMapsObject.getCenter();
            th.x = xy.lat();
            th.y = xy.lng();
            th.reSearch();
          });
        }
      );
      var reSearchBtnHtml =
        '<button type="button" id="btnReSearch" style= "display:none;background-color: #ed1b2e;color: #fff;justify-content: center; pointer-events: auto;max-width: 200px;padding: 2px 10px 1px;font-size: 12px;line-height: 25px;letter-spacing: -.7px;text-align: left;white-space: nowrap;border: 0;margin-top: 10px;"><span>주변 약국 재검색</span></button>';
      naver.maps.Event.once(
        window.$naverMapsObject,
        "init_stylemap",
        function() {
          //customControl 객체 이용하기
          var $reSearchBtn = $(reSearchBtnHtml),
            reSearchBtnEl = $reSearchBtn[0];
          window.$naverMapsObject.controls[naver.maps.Position.TOP_CENTER].push(
            reSearchBtnEl
          );
          naver.maps.Event.addDOMListener(reSearchBtnEl, "click", function() {
            this.reSearch();
          });
        }
      );
    },
    onWindowLoad(that) {},
    onMarkerClicked(event) {
      this.info = !this.info;
    },
    onMarkerLoaded(vue, v) {
      this.marker = vue.marker;
    }
    // 반응형 설계 하다가 다시 그냥 설계함
    // handleResize() {

    //   console.log(this.width,this.height)
    // }
  },
  //버린다 반응형 그냥 처음 로딩 될 때만 확인하기
  created() {
    this.width = window.innerWidth;
    this.height = window.innerHeight * 0.9;
  },
  // destroyed() {
  //   window.removeEventListener("resize", this.handleResize);
  // },
  mounted() {}
};
</script>
<style scoped>
.info-window-container {
  padding: 10px;
  width: 300px;
  height: 100px;
}
</style>