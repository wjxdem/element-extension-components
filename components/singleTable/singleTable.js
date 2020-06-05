'user strict';
import './singleTable.less';
import { numberForm } from '../../utils/utils.js';

/**
 * 单选表格组件
 * 引用此组件，需要提供
 * 1. 列信息（列type，内容，宽度等）
 * 2. 数据信息（id， 内容， 回调方法等： 根据列type提供）
 * 3. 页码导航（总条数、当前页码、每页条数）
 */
export default {
  name: 'single-table',
  data() {
    return {
      radio: ''
    };
  },
  methods: {
    handleSizeChange(val) {
      if (this.pagination && this.pagination.sizeChange) {
        this.pagination.sizeChange(val);
      }
    },
    handleCurrentChange(val) {
      if (this.pagination && this.pagination.currentPageChange) {
        this.pagination.currentPageChange(val);
      }
    },
    getTotal() {
      return numberForm(this.pagination.total);
    },
    showRow(row) {
      if (
        this.singleSelectionChange &&
        typeof this.singleSelectionChange === 'function'
      ) {
        this.radio = this.contents.indexOf(row);
        this.singleSelectionChange(row);
      }
    }
  },
  props: [
    'columns',
    'contents',
    'pagination',
    'singleSelectionChange',
    'clearFlag'
  ],
  updated() {},
  watch: {
    clearFlag: {
      handler: function(val) {
        if (val) {
          this.radio = '';
        }
      },
      immediate: true
    }
  }
};
