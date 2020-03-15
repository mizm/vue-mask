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
      <naver-info-window class="info-window" @load="onWindowLoad" :isOpen="info" :marker="marker">
        <div class="info-window-container">
          <h1>{{hello}}</h1>
        </div>
      </naver-info-window>
      <naver-marker
        v-for="(v,i) in markers"
        :key="i"
        :lat="v.lat"
        :lng="v.lng"
        @click="onMarkerClicked"
        @load="onMarkerLoaded"
      />
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
      info: false,
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
    hello() {
      return `Hello, World! × ${this.count}`;
    }
    // user_location () {
    //   if(this.map)
    //   return this.map.getCenter();
    //   else
    //   return (37,127)
    // }
  },
  methods: {
    reSearch() {
      console.log(new naver.maps.LatLng(this.map.getCenter()));
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
        })
        .catch(e => {});
    },
    drag() {
      var xy = window.$naverMapsObject.getCenter();
      this.x = xy.lat();
      this.y = xy.lng();
      this.reSearch();
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
            console.log(this.x,this.y)
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
      console.log(naver.maps);
      console.log(window.naver.maps);
      naver.maps.Event.addListener(
        window.$naverMapsObject,
        "dragend",
        function() {
          th.drag();
        }
      );
    },
    onWindowLoad(that) {},
    onMarkerClicked(event) {
      this.info = !this.info;
    },
    onMarkerLoaded(vue) {
      this.marker = vue.marker;
    }
  },
  mounted() {
    setInterval(() => this.count++, 1000);
  }
};
</script>
<style scoped>
.info-window-container {
  padding: 10px;
  width: 300px;
  height: 100px;
}
</style>