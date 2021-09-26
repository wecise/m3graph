<template>
    <el-container class="search-bar">
        <el-header style="display:flex;height:35px;line-height:35px;padding:0px;">
            <el-button type="text" :icon="controlStatus" @click="control.show=!control.show"></el-button>
            <template v-if="control.show">
                <el-input v-model="entity.search.term" placeholder="搜索实体、活动关键字" 
                    @clear="onEntityClear"
                    @keyup.enter.native="onEntitySearch" 
                    clearable autofocus class="input">
                    <template slot="prepend">
                        <el-dropdown trigger="hover" placement="top-end"  :hide-on-click="true">
                            <el-tooltip content="选则实体类">
                                <el-button type="text" size="mini">
                                    <span class="el-icon-office-building" style="font-size:16px;"></span>
                                </el-button>
                            </el-tooltip>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item>
                                    <ActionView root="/matrix/entity" @node-click="onEntityTreeSelected"></ActionView>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-input>
                <el-button type="text" class="path" @click="$emit('toggle-view','PathBar')">
                    <el-image src="/static/assets/images/tools/png/path-blue.png" style="width:16px;"></el-image>
                </el-button>
                <el-button type="text" class="adv" @click="$emit('toggle-view','AdvBar')">
                    高级
                </el-button>
                <el-button type="success" class="search" :loading="entity.search.loading">
                    <span class="el-icon-search"></span>
                </el-button>
                <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                        <el-button type="text" icon="el-icon-folder-opened" ></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="onFileNew">新建</el-dropdown-item>
                        <el-dropdown-item @click.native="dialog.fileOpen.show = true" divided>打开</el-dropdown-item>
                        <el-dropdown-item @click.native="onFileOpenTo">打开到</el-dropdown-item>
                        <el-dropdown-item @click.native="onFileSave" divided>保存</el-dropdown-item>
                        <el-dropdown-item @click.native="onFileSaveAs">另存为</el-dropdown-item>
                        <el-dropdown-item @click.native="onSaveAsPdf">另存为PDF</el-dropdown-item>
                        <el-dropdown-item @click.native="onFileDelete" divided>删除</el-dropdown-item>
                        <el-dropdown-item @click.native="onFilePrint" divided>打印</el-dropdown-item>
                        <el-dropdown-item @click.native="onFileClose" divided>关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </template>
        </el-header>
        <el-main style="width:100%;height:40vh;padding:0px;border-top:1px solid #409EFF;" v-show="searchResultStatus">
            <div class="div-hover-effect" style="display:flex;padding:10px;cursor:pointer;" 
                v-for="(item,index) in entity.search.result"
                :key="index"
                @click="onEntitySelect(item)"
                draggable="true" 
                @dragstart="onEntityDragStart(item,$event)">
                <el-image :src="item | pickIcon" style="width:15%;height:15%;max-width:48px;min-width:48px;" slot="suffix">
                    <div slot="error" class="image-slot">
                        <i class="el-icon-picture-outline"></i>
                    </div>
                </el-image>
                <div style="height:48px;line-height:48px;width:80%;padding-left:10px;">{{ item.value }}</div>
                <el-tooltip content="拖动到画布">
                    <el-button type="text" icon="el-icon-menu" style="padding-left:10px;cursor:pointer;"></el-button>
                </el-tooltip>
                <el-tooltip content="实体分析">
                    <el-button type="text" icon="el-icon-postcard" style="padding-left:10px;cursor:pointer;" @click="onEntityDiagnosis(item)">
                    </el-button>
                </el-tooltip>
            </div>
            <el-button type="text" icon="el-icon-down"></el-button>
        </el-main>
        <!-- 打开窗口 -->
        <el-dialog title="打开" 
                :visible.sync="dialog.fileOpen.show"
                v-if="dialog.fileOpen.show"
                :modal-append-to-body="false"
                modal="false">
            <DfsOpen dfsRoot="/script/matrix/m3graph/data/graph" ref="dfsOpen"></DfsOpen>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.fileOpen.show = false">取 消</el-button>
                <el-button type="primary" @click="onFileOpen(false)">打 开</el-button>
            </div>
        </el-dialog>
        <!-- 打开到窗口 -->
        <el-dialog title="打开到" 
            :visible.sync="dialog.fileOpenTo.show"
            v-if="dialog.fileOpenTo.show">
            <DfsOpen dfsRoot="/script/matrix/m3graph/data/graph" ref="dfsOpen"></DfsOpen>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.fileOpenTo.show = false">取 消</el-button>
                <el-button type="primary" @click="onFileOpenTo(false)">打 开 到</el-button>
            </div>
        </el-dialog>
        <!-- 保存窗口 -->
        <el-dialog title="保存" 
            :visible.sync="dialog.fileSaveAs.show">
            <DfsOpen dfsRoot="/script/matrix/m3graph/data/graph" ftype="imap" ref="dfsSaveas"></DfsOpen>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialog.fileSaveAs.show = false">取 消</el-button>
                <el-button type="primary" @click="onFileSaveAs">保存</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import _isEmpty from 'lodash/isEmpty';
import _map from 'lodash/map';
import _extend from 'lodash/extend';

import toggleBarMixin from '../../mixins/index.js';

export default {
    name: "SearchBar",
    mixins: [toggleBarMixin],
    components:{
        ActionView: resolve => {require(['../ActionView.vue'], resolve)},
        DfsOpen: resolve => {require(['../../dfs/DfsOpen.vue'], resolve)}
    },
    data(){
        return {
            control: {
                show: true
            },
            entity: {
                search: {
                    loading: false,
                    term: "",
                    result: null
                },
                selected: null
            },
            dialog: {
                fileOpen: {
                    show: false
                },
                fileOpenTo: {
                    show: false
                },
                fileSaveAs: {
                    show: false
                }
            }
        }
    },
    watch: {
        'entity.search.term':function(val){
            if(_isEmpty(val)){
                this.onEntityClear();
            }
        }
    },
    computed:{
        controlStatus(){
            if(this.control.show){
                return 'el-icon-arrow-left';
            } else {
                return 'el-icon-arrow-right';
            }
        },
        searchResultStatus(){
            return this.control.show && this.entity.search.result && this.entity.search.result.length > 0;
        }
    },
    filters: {
        pickIcon(item){
            let icon = item.icon;
            return `/static/assets/images/entity/png/${icon}.png`;
        }
    },
    methods: {
        onToggleBar(){
            this.control.show = !this.control.show; 
        },
        onEntityTreeSelected(data){
            this.entity.search.term = data.alias;
            this.onEntitySearch();
        },
        onEntityClear(){
            this.entity.search.selected = null;
            this.entity.search.result = null;
        },
        onEntitySearch() {

            this.entity.search.loading = true;
            
            if(_isEmpty(this.entity.search.term)){
                return false;
            }

            let param = encodeURIComponent(this.entity.search.term);
            this.m3.callFS("/matrix/m3graph/entity-search-by-term.js",param).then( rtn=>{
                
                let entitys = rtn.message;

                if(_isEmpty(entitys)){
                    this.$message({
                        type: "info",
                        message: "没有匹配数据！"
                    })

                    this.entity.search.result = [];

                    this.entity.search.loading = false;

                    return false;
                }

                this.entity.search.result = entitys;

                this.entity.search.result = _map(this.entity.search.result,(v)=>{
                    return _extend(v,{ cell: {edge:false} } );
                })

                this.entity.search.loading = false;

            } )
            
        },
        onEntitySelect(){

        },
        onEntityDragStart(item,event){
            event.dataTransfer.setData("Text",JSON.stringify(item));
        },
        onEntityDragEnd(){

        },
        ononEntityDiagnosis(){

        },
        onFileNew(){
            /* this.deleteCells(true);
            this.file.doc = null; */
        },
        onFileOpen(auto){
            /* try{
                
                let editor = inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor;

                // 选择文件打开
                if(!auto){
                    this.file.doc = this.$refs.dfsOpen.node;
                }
                
                let xml = fsHandler.fsContent(this.file.doc.parent, this.file.doc.name);
                let doc = mxUtils.parseXml(xml);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, editor.graph.getModel());
            } catch(err){
                console.error(err);
            } finally {
                this.file.dialogOpen.visible = false;
                inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.toCenter();
            } */
            
        },
        onFileOpenTo(auto){
            /* // 新建图
            let graph = new mxGraph();
            let parent = graph.getDefaultParent();
            
            try{
                
                

                // 选择文件打开
                if(!auto){
                    this.file.doc = this.$refs.dfsOpen.node;
                }
                
                let xml = fsHandler.fsContent(this.file.doc.parent, this.file.doc.name);
                let doc = mxUtils.parseXml(xml);
                let codec = new mxCodec(doc);
                codec.decode(doc.documentElement, graph.getModel());

                // 合并到当前图
                let editor = inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor;
                editor.graph.getModel().mergeChildren(graph.getModel().getRoot(), editor.graph.getDefaultParent());

                // Executes the layout handler
                _.delay(()=>{
                    inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.executeLayout();
                },500)
            } catch(err){
                console.error(err);
            } finally {
                this.file.dialogOpenTo.visible = false;
            } */
            
        },
        onFileSave(){
            /* if(this.file.doc){
                let editor = inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor;
                let enc = new mxCodec(mxUtils.createXmlDocument());
                let node = enc.encode(editor.graph.getModel());
                let xml = mxUtils.getPrettyXml(node);
                let attr = _.extend(this.file.doc, {});
                let rtn = fsHandler.fsNew('file',this.file.doc.parent, this.file.doc.name, xml, attr);
                if(rtn == 1){
                    this.$message({
                        type:"success",
                        message: "保存成功！"
                    })
                }
            } else {
                this.file.dialogSaveAs.visible = true;
            } */
        },
        onFileSaveAs(){
            
            /* let editor = inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor;

            let enc = new mxCodec(mxUtils.createXmlDocument());
            let node = enc.encode(editor.graph.getModel());
            let xml = mxUtils.getPrettyXml(node);
            let attr = {};
            
            let parent = this.$refs.dfsSaveas.node.fullname;
            let name = this.$refs.dfsSaveas.fileName;
            let rtn = fsHandler.fsNew('file',parent, name, xml, attr);
            if(rtn == 1){
                this.$message({
                    type:"success",
                    message: "保存成功！"
                })
                
                this.file.doc = {parent:parent, name:name, fullname: [parent,name].join("/")};
            }

            this.file.dialogSaveAs.visible = false; */
        },
        onSaveAsPdf(){
            // mxUtils.printScreen(inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor.graph);
        },
        onFileClose(){
            // this.deleteCells(true);
            // this.file.doc = null;
        },
        onFilePrint(){
            // inst.app.$refs.graphViewRef.$refs.graphViewContainerInst.model.editor.execute('print');
        },
        onFileDelete(){
            /* if(this.file.doc){

                this.$confirm(`确认要删除该设计文档：${this.file.doc.name}？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let rtn = fsHandler.fsDelete(this.file.doc.parent,this.file.doc.name);

                    if (rtn == 1){
                        this.$message({
                            type: "success",
                            message: "删除成功！"
                        });
                        this.deleteCells(true);
                        this.file.doc = null;
                        localStorage.setItem("CLASS-DESIGN-OPEN-FILE",'');
                        this.summaryInfo();
                    } else {
                        this.$message({
                            type: "error",
                            message: "删除失败 " + rtn.message
                        })
                    } 
                }).catch(() => {
                    
                });
            } */
        }
    }
}
</script>

<style scoped>
    .search-bar.el-container{
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 1000;
        background: #f2f2f2;
    }
    .search-bar .el-header{
        text-align: center;
        border: 1px solid #f2f2f2;
    }
    .search-bar .el-button+.el-button {
        margin-left: 0px;
    }
    .search-bar .el-button{
        color: #777777;
        width: 50px;
        border-radius: 0px!important;
    }

    .search-bar .input{
        width: auto;
        min-width: 10vw;
    }

    .search-bar .search span{
        color: #ffffff;
    }
</style>
<style>
    .search-bar .el-input-group__append, .el-input-group__prepend{
        border: unset!important;
    }
    .search-bar .el-input--mini .el-input__inner {
        height: 33px!important;
        line-height: 33px!important;
        border: 1px solid #f2f2f2!important;
        border-radius: 0px!important;
    }
</style>