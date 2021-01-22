import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import './plugins/element.js'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
// dark theme
import './assets/theme/element-#252D47/index.css'
// blue theme
// import './assets/theme/element-#409EFF/index.css'
import moment from 'moment'
import animate from 'animate.css'

const m3 = require("@cnwangzd/m3js");

Vue.use(animate);
Vue.use(VueI18n);

Vue.config.productionTip = false;

Vue.prototype.moment = moment;
Vue.prototype.moment.locale(window.M3_LANG);

window.M3_LANG = 'zh-CN';

/* 
 * 测试环境
*/
if(process.env.NODE_ENV === "development"){
  m3.connect("47.92.151.165",8080,"wecise","admin","admin");
  //m3.connect("18.188.85.82",8080,"wecise","admin","admin");
} else {
  m3.init();
}

setTimeout(()=>{

  m3.lang().then( (rtn)=>{
    
    window.global = m3.global;
    
    const i18n = new VueI18n({
      locale: window.M3_LANG,
      messages: rtn
    });

    // ElementUI Setup
    ElementUI.Tooltip.props.openDelay.default = 800;

    Vue.prototype.$ELEMENT = { 
      size: 'small',
      i18n: (key, value) => i18n.t(key, value)
    };

    new Vue({
      render: h => h(App),
      i18n
    }).$mount('#app')
  })

},5000)
