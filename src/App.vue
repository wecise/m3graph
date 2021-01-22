<template>
  <el-container class="m3">
    <el-header>
        <el-row type="flex" :gutter="0">
            <el-col :span="19">
                <el-link href="/" :underline="false" v-if="auth">
                  <el-image :src="auth.Company.logo" fit="contain"></el-image>
                </el-link>
                <span style="position: absolute;left: 40px;">{{auth.Company.title}}</span>
            </el-col>
            <el-col :span="1" style="text-align: right;">
                <div id="ai-robot"></div>
            </el-col>
            <el-col :span="3" style="text-align: right;">
                
            </el-col>
            <el-col :span="2">
                <el-menu :default-active="activeIndex" 
                        class="topbar-el-menu" 
                        mode="horizontal" 
                        menu-trigger="hover"
                        @select="onSelect">
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-user-solid" style="color:#ffffff;"></i> {{ auth.username }}
                        </template>
                        <el-menu-item index="/matrix/user">
                            <template slot="title">
                                <i class="el-icon-user"></i>
                                <span slot="title">用户</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/matrix/system" divided v-if="auth.isAdmin">
                            <template slot="title">
                                <i class="el-icon-setting"></i>
                                <span slot="title">系统管理</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="/matrix/files">
                            <template slot="title">
                                <i class="el-icon-folder-opened"></i>
                                <span slot="title">我的文件</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="home">
                            <template slot="title">
                                <i class="el-icon-s-home"></i>
                                <span slot="title">默认首页</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="signout" divided>
                            <template slot="title">
                                <i class="el-icon-switch-button"></i>
                                <span slot="title">注销</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
      </el-header>
    <el-main>
      <MainView :global="global" v-if="global"></MainView>
    </el-main>
  </el-container>
</template>

<script>
import MainView from './components/MainView.vue'
const m3 = require("@cnwangzd/m3js");
import _ from 'lodash';

export default {
  name: 'app',
  components: {
    MainView
  },
  data(){
    return {
      global:null,
      auth: null,
      activeIndex: '1'
    }
  },
  mounted(){
    setTimeout(()=>{
      this.global = m3.global;
      this.auth = m3.auth.signedUser;
      m3.setTitle(this.auth);
    },500)
  },
  methods: {
    onSelect(key) {
        if(_.startsWith(key,'/matrix/')){
            window.open(key, '_blank');
        } else {
            if(key === 'home'){
                m3.setAppAsHome(this,{url:'/home'});
            } else if(key==='signout'){
                window.open(`/user/logout/${this.auth.Company.name}`,'_parent');
            } 
        }
    }
  }
}
</script>

<style>
  body{
    overflow: hidden!important;
    font-size: 12px;
    font-family: "PingFang SC",Arial,"Microsoft YaHei",sans-serif;
    margin: 0px;
    padding: 0px;
  }

  .m3 > .el-header{
    height: 50px!important;
    line-height: 50px;
    /* background: rgb(37, 45, 71); */
    background: #252D47;
    color: #ffffff;
    padding: 0px 0px 0px 10px;
  }

  .m3 > .el-header .el-image > .el-image__inner{
    max-width: 120px;
    min-width: 32px;
    width: 32px;
    height: 32px;
    padding: 7px 0px;
  }

  .m3 > .el-main{
    padding: 0px;
  }

  .el-link.el-link--default {
    color: #ffffff;
  }

  .el-table--enable-row-hover .el-table__body tr:hover>td {
      background-color: #409eff!important;
  }
  
  .el-table__body tr.current-row>td {
      background-color:#409eff!important;;
  }

  .el-table .cell {
      white-space: nowrap!important;
      line-height: 18px!important;
  }

  .el-table .el-table__body-wrapper {
    overflow: auto;
    position: relative;
    height: calc(100% - 50px)!important;
}

  .topbar-el-menu .el-submenu__icon-arrow.el-icon-arrow-down{
		color: #ffffff;
	}

	.el-menu-item:hover{
		background-color: #409dfe!important;
	}

  .topbar-el-menu.el-menu.el-menu--horizontal {
		border-bottom: unset;
		background: #242c46;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal >.el-menu-item {
		height: 30px;
		line-height: 30px;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal>.el-submenu {
		float: right;
	}
	.topbar-el-menu.el-menu.el-menu--horizontal >.el-submenu .el-submenu__title {
		height: 50px;
		line-height: 50px;
		border-bottom: unset;
		color: #ffffff;
	}

  .el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, 
  .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, 
  .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
      background-color: #409dfe!important;
  }
</style>
