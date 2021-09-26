<template>
    <el-timeline style="width:90%;">
        <el-timeline-item
            v-for="(ac, index) in dt"
            :key="index"
            :icon="ac._icon"
            type="default"
            size="large"
            placement="top"
            :timestamp="ac|formatTime">
            <el-card :style="ac | pickBgStyle">
                <h2>{{ac.node || ac.name}}</h2>
                <p>{{ac.msg || ac.name}}</p>
                <p>{{moment(ac.vtime).format('LLL')}}</p>
            </el-card>
        </el-timeline-item>
    </el-timeline>
</template>

<script>
import _ from 'lodash';

export default {
    props: {
        model: Object,
        global: Object
    },
    computed:{
        dt(){
            let data = [];
            _.forEach(this.model,(v,k) => {
                if(k==='all') return;
                _.forEach(v.rows,r=>{
                    data.push(_.extend(r, {_title:v.title, _icon: v.icon, _type: k}));
                });
            });

            return _.sortBy(data,['vtime'],['desc']);
        }
    },
    filters:{
        formatTime(data){
            return `${window.moment(data.vtime).format("YYYY-MM-DD HH:mm:SS")}  ${data._title}`;
        },
        pickBgStyle(data){
            
            if(data._type !== 'event') return;

            let hexToRgba = function(hex, opacity) {
                var RGBA = "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt( "0x" + hex.slice(5, 7)) + "," + opacity + ")";
                return {
                    red: parseInt("0x" + hex.slice(1, 3)),
                    green: parseInt("0x" + hex.slice(3, 5)),
                    blue: parseInt("0x" + hex.slice(5, 7)),
                    rgba: RGBA
                }
            };
            let rgbaColor = hexToRgba(window.global.register.event.severity[data.severity][2],0.1).rgba;
            return `background:linear-gradient(to top, ${rgbaColor}, rgb(255,255,255));border: 1px solid rgb(247, 247, 247);border-radius: 5px;box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;line-height:1.5;`;
        }
    }
}
</script>