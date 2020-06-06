<!--
/*@author: jesse wu
 *基于el-popover,el-input的行内搜索下拉
 *用法： <inline-search-select  @select-change="handleChange"></inline-search-select>
 */
 -->
<template>
  <el-popover placement="bottom-start" width="300" trigger="manual" v-model="selectFlag">
    <div class="selected-box">
      <el-input v-model="searchInput" class="elInput" placeholder="请搜索" @input="handleGetList"></el-input>
      <ul class="select-list">
        <div class="list-title" v-if="selectOptions.length">最近访问的项目</div>
        <li class="select-item" v-for="item in selectOptions" :key="item.id">
          <span
            class="item-name"
            :title="item.topic"
            @click.stop="handleSelected(item)"
          >{{ item.topic }}</span>
        </li>
      </ul>
    </div>
    <span slot="reference" @click.stop="handleShow">
      <span class="current-selected-name" :title="currentItem.topic">{{ currentItem.topic }}</span>
      <i class="el-icon-caret-bottom"></i>
    </span>
  </el-popover>
</template>

<script>
export default {
  name: 'inline-search-select',
  props: {},
  data() {
    return {
      selectFlag: false,
      searchInput: '',
      selectOptions: [],
      currentItem: {}
    };
  },
  created(){
    this.handleGetList();
  },
  methods: {
    handleSelected(item) {
      this.selectFlag = false;
      this.searchInput = '';
      this.currentItem = item;
      this.$emit('select-change',item);
    },
    handleShow() {
      this.selectFlag = !this.selectFlag;
    },
    handleGetList(query) {
      //远程模糊搜索
      this.loading = true;
      if (query !== undefined) {
        if (query.target) {
          query = '';
        }
      }
      Api.request({
        url: '/XXXXXXX',
        method: 'get',
        data: {
          projectNo: query
        }
      })
        .then(res => {
          if (res.success && res) {
            this.loading = false;
            this.selectOptions = res.data ? res.data : [];
            this.currentItem = this.selectOptions[0];//默认选择第一项
          }
        })
        .finally(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.select-list {
  margin-top: 10px;
  width: 300px;
  height: 220px;
  overflow-x: hidden;
  overflow-y: auto;
  .list-title {
    padding-left: 6px;
    font-size: 12px;
    color: #909399;
    line-height: 30px;
  }
}
.current-selected-name {
  max-width: 300px;
  display: inline-block;
  vertical-align: middle;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
  color: #303133;
  font-size: 14px;
}
/deep/.el-icon-caret-bottom {
  color: #999;
  font-size: 12px;
}
/*滚动条整体样式（宽高）*/
.select-list::-webkit-scrollbar {
  width: 4px;
}
/*滚动条里面小方块*/
.select-list::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #dcdfe6;
}
/*滚动条里面轨道*/
.select-list::-webkit-scrollbar-track {
  // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 0;
}
.select-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 6px;
  padding-right: 16px;
  height: 30px;
  cursor: pointer;
  .item-name {
    width: 290px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  &:hover {
    background-color: #f5f7fa;
  }
}
</style>