'user strict';
import './commonTable.less';

/**
 * 表格组件
 * 引用此组件，需要提供
 * 1. 列信息（列type，内容，宽度等）
 * 2. 数据信息（id， 内容， 回调方法等： 根据列type提供）
 * 3. 页码导航（总条数、当前页码、每页条数）
 * 4. 底部提示信息（提示内容）
 * 用法示例eg:
 * <common-table
      class="table"
      :columns="columns"
      :contents="tableData"
      :pagination="pagination"
    ></common-table>
 * columns: [{ prop: 'typeDesc', label: '需求类型', type: 'text',onClick: data => {
 *           if (data.type === 4) {
 *             this.$emit('aaa', { id: data.id });
 *           }
 *         }, width: 100 }...],
 * tableData: [],
 * pagination: {
 *       total: 0,
 *       currentPage: 1,
 *       currentPageSize: 10,
 *       currentPageChange: page => {
 *         this.pagination.currentPage = page;
 *         this.params.searchFlag = false;
 *         this.handleflushFilter(this.params);
 *       },
 *       sizeChange: size => {
 *         this.pagination.currentPageSize = size;
 *         this.params.searchFlag = false;
 *         this.handleflushFilter(this.params);
 *       }
 *     }
 */
export default {
  name: 'common-table',
  data() {
    return {};
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

    handleSelectionChange(val) {
      if (
        this.onSelectionChange &&
        typeof this.onSelectionChange === 'function'
      ) {
        this.onSelectionChange(val);
      }
    },
    handlesort(val) {
      if (this.onsort && typeof this.onsort === 'function') {
        this.onsort(val);
      }
    },
    handleSelectable(val) {
      return this.selectable(val);
    }
  },
  props: [
    'columns',
    'contents',
    'defaultsort',
    'clearSort',
    'tableHeight',
    'pagination',
    'bottomHint',
    'bottomLeftButton',
    'isMultipleSelect',
    'onSelectionChange',
    'onsort',
    'selectable',
    'dragWidth'
  ],
  watch: {
    clearSort: {
      handler(val) {
        if (val) {
          this.$refs.sortTable.clearSort();
        }
      },
      immediate: true
    }
  }
};
