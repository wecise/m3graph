<template>
    <el-container>
        <el-header style="height:60px;line-height:60px;background-color:#f2f2f2;padding:10px;">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="选择目录">
                    <el-input v-model="node.fullname" v-if="node.fullname"></el-input>
                </el-form-item>
            </el-form>
        </el-header>
        <el-main style="padding:10px 0px;height:260px;">
            <el-tree v-if="classList"
                :data="classList"
                node-key="id"
                :default-expanded-keys="defaultExpandedKeys"
                :props="defaultProps"
                @node-click="onNodeClick"
                accordion="true"
                style="background-color:transparent;">
                <span slot-scope="{ node, data }">
                    <span class="el-icon-files"></span>
                    <span>{{ data.name }}</span>
                </span>
            </el-tree>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';

export default {
    name: "DfsOpen",
    props:{
        dfsRoot:String
    },
    data(){
        return {
            classList: [],
            defaultProps: {
                children: 'children',
                label: 'alias'
            },
            node: {},
            form: {
                name: "",
                attr: ""
            }
        }
    },
    computed:{
        defaultExpandedKeys(){
            return [_.first(this.classList).id];
        }
    },
    created(){
        let param = encodeURIComponent(JSON.stringify({path:this.dfsRoot,onlyDir:false, ftype:['xml','imap']}));
        this.m3.callFS("/matrix/m3graph/fs_list.js",param).then( (rtn)=>{
            this.classList = rtn.message;

            // 默认创建目录
            _.extend(this.node,{fullname: this.dfsRoot});
        } );
    },
    methods:{
        onNodeClick(node){
            this.node = node;
        }
    }
}
</script>
