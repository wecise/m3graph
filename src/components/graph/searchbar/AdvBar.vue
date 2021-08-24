<template>
    <el-container class="adv-bar">
        <el-header style="display:flex;height:35px;line-height:35px;padding:0px;">
            <el-button type="text" :icon="controlStatus" @click="control.show=!control.show"></el-button>
            <template v-if="control.show">
                <el-input placeholder="搜索实体、活动关键字" class="input" disabled></el-input>
                <el-button type="text" @click="$emit('toggle-view','SearchBar')">
                    <span class="el-icon-close" style="font-size:14px;font-weight: 900;"></span>
                </el-button>
                <el-button type="success" class="search" :loading="search.loading" @click="onSearch">
                    <span class="el-icon-search"></span>
                </el-button>
            </template>
        </el-header>
        <div v-show="control.show">
            <el-main style="width:100%;height:30vh;border-top:1px solid #409EFF;">
                <Editor
                    v-model="editor.data"
                    @init="onEditorInit"
                    :lang="editor.lang.value"
                    :theme="editor.theme.value"
                    width="100%"
                    height="80%"
                    style="border:1px solid #f2f2f2;"
                    ref="editorRef">
                </Editor>
            </el-main>
            <el-footer>
                <div :loading="search.loading">保存中...</div>
            </el-footer>
        </div>
    </el-container>
</template>

<script>
import _ from 'lodash';
import toggleBarMixin from '../../mixins/index.js';

export default {
    name: "AdvBar",
    mixins: [toggleBarMixin],
    components:{
        Editor:require("vue2-ace-editor"),
    },
    data(){
        return {
            control: {
                show: true
            },
            search: {
                loading: false,
                term: "",
                result: null
            },
            selected: null,
            editor: {
                data: null,
                loading: false,
                lang: {
                    value: "sql",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                }
            }
        }
    },
    watch: {
        'search.term':function(val){
            if(_.isEmpty(val)){
                this.onClear();
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
    created(){
        this.onLoadHistory();
    },
    methods: {
        onToggleBar(){
            this.control.show = !this.control.show; 
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language

            let editor = this.$refs.editorRef.editor;
            editor.on('change', _.debounce(()=> {
                this.onSaveAsHistory();
            }),1000);

        },
        onLoadHistory(){
            let param = encodeURIComponent(JSON.stringify({action:'load',value:null}));
            this.m3.callFS("/matrix/m3graph/history.js", param).then(res=>{
                this.editor.data = res.message;
            })
        },
        onSaveAsHistory(){
            let param = encodeURIComponent(JSON.stringify({action:'save',value: this.editor.data}));
            this.m3.callFS("/matrix/m3graph/history.js", param).then(res=>{
                console.log(res)
            })
        },
        onEntityTreeSelected(data){
            this.search.term = data.alias;
            this.onSearch();
        },
        onClear(){
            this.search.selected = null;
            this.search.result = null;
        },
        onSearch() {

            let editor = this.$refs.editorRef.editor;
            this.search.term = editor.getSelectedText() || editor.getValue();

            this.search.loading = true;
            
            if(_.isEmpty(this.search.term)){
                this.search.loading = false;
                return false;
            }

            this.m3.callFS("/matrix/m3graph/graphService.js", encodeURIComponent(this.search.term)).then( res=>{
            
                this.$emit("graph-data",res.message[0].graph);

                this.search.loading = false;

                this.control.show = false;

            }).catch(()=>{
                this.search.loading = false;
            });
            
        }
    }
}
</script>

<style scoped>
    .adv-bar.el-container{
        position: absolute;
        left: 10px;
        top: 10px;
        z-index: 1000;
        background: #f2f2f2;
    }
    .adv-bar .el-header{
        text-align: center;
        border: 1px solid #f2f2f2;
    }
    .adv-bar .el-button+.el-button {
        margin-left: 0px;
    }
    .adv-bar .el-button{
        color: #777777;
        width: 50px;
        border-radius: 0px!important;
    }

    .adv-bar .input{
        width: auto;
        min-width: 83vw;
    }

    .adv-bar .search span{
        color: #ffffff;
    }

    .adv-bar .el-divider__text {
        background-color: transparent;
        color: #777777;
    }
</style>
<style>
    .adv-bar .el-input-group__append, .el-input-group__prepend{
        border: unset!important;
    }
    .adv-bar .el-input--mini .el-input__inner {
        height: 33px!important;
        line-height: 33px!important;
        border: transparent!important;
        background: transparent!important;
        border-radius: 0px!important;
    }
</style>