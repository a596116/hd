<template>
  <main class="flex h-full w-full flex-col" :class="{ 'gap-y-2': showHeader }">
    <section v-if="showHeader" class="flex w-full items-center justify-between">
      <div>
        <slot name="radio"></slot>
      </div>
    </section>
    <!-- 關鍵字、日期搜尋 -->
    <section v-if="showHeader" class="flex justify-between border-b pb-3">
      <section class="flex flex-col items-center gap-3 lg:flex-row">
        <div class="w-full px-4 lg:w-fit lg:min-w-[300px]">
          <h5 class="text-xs leading-6 tracking-widest text-gray-500">關鍵字搜尋</h5>
          <el-input
            class="rounded-md border border-gray-300"
            v-model="state.search"
            :placeholder="searchPlaceholder"
            clearable
            @input="actions.handleAutoSearch"
            @keyup.enter="actions.handleSearchByKeyword">
          </el-input>
        </div>
        <div class="w-full lg:w-fit">
          <PickerDate
            v-if="actions.handleShowButton('search-updated-date')"
            v-model:date="propsTableData.search_params.updated_at"
            :label-text="labelTextDate"
            @date-change="actions.handleSearchByUpdateDate" />
        </div>

        <div class="w-full lg:w-fit">
          <PickerDateRange
            v-if="actions.handleShowButton('search-date-range')"
            class="w-full-date"
            :date-range="[
              propsTableData.search_params?.start_date,
              propsTableData.search_params?.end_date,
            ]"
            :label-text="labelTextDateRange"
            @date-change="actions.handleSearchByDateRange" />
        </div>

        <slot name="filterSection"> </slot>
        <div class="flex w-full justify-center lg:justify-start lg:self-end">
          <div class="w-full lg:max-w-min">
            <el-button
              type="primary"
              class="w-full font-normal text-white"
              auto-insert-space
              @click="actions.handleChange">
              <svg-icon name="search" class="mr-2 h-[16px] w-[16px]"></svg-icon>
              搜 尋
            </el-button>
          </div>
          <div>
            <slot name="advancedSearch"></slot>
          </div>
        </div>
      </section>

      <slot name="filterDateSection"></slot>
    </section>

    <!-- 批次設定 / 頁數切換、重整-->
    <section class="my-2 flex items-center justify-between">
      <section class="flex items-center gap-x-6">
        <transition name="slide-fade" mode="out-in">
          <section v-if="multipleSelection?.length > 0" class="flex items-center gap-x-3">
            <small class="font-base tracking-widest text-hd-text">
              已選
              <strong class="font-medium text-hd-primary">{{ multipleSelection?.length }}</strong>
              項
            </small>

            <ButtonGroupPermission @on-command="actions.handleCommand" />
          </section>
        </transition>
        <slot name="refreshTime"></slot>
      </section>
      <section
        v-if="actionButtons.length > 0"
        class="flex flex-grow items-center justify-end"
        :class="{ 'gap-x-3': actions.handleShowButton('batch') }">
        <ButtonCreate
          v-if="actions.handleShowButton('create')"
          @on-create="actions.handleCommand('create')" />
      </section>
    </section>

    <!-- 表格 -->
    <el-table
      ref="refDefaultTable"
      v-loading="loading"
      tooltip-effect="light"
      :max-height="setMaxHeight ? '480' : '100%'"
      class="default-table cursor-default"
      style="width: 100%"
      size="small"
      :data="isExpand || props.tableData.data"
      :row-key="rowKey ? rowKey : (row) => row.id"
      :height="tableHeight == 'auto' ? null : tableHeight"
      table-layout="fixed"
      :show-summary="showSummary"
      :header-cell-style="formatTableStyle.header"
      :row-style="formatTableStyle.row"
      :row-class-name="formatTableStyle.tableRowClassName"
      :cell-class-name="formatTableStyle.tableColClassName"
      @selection-change="actions.handleSelectionChange"
      @sort-change="actions.handleSortChange"
      @cell-click="actions.handleCellClick"
      @row-click="actions.handleRowClick">
      <slot name="showSelectedCol"></slot>
      <!-- select -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        align="center"
        width="55"
        :reserve-selection="true" />
      <!-- index -->
      <el-table-column
        v-if="showIndex"
        type="index"
        width="60"
        align="center"
        label="項次"
        :index="actions.handleIndex" />
      <!-- expand -->
      <el-table-column v-if="showExpandCol" width="55" align="center" type="expand">
        <template #default="scope">
          <slot name="expand" :row="scope.row"></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-for="{ prop, label, align, width, formatter, sort, type } in columns"
        :key="prop"
        :prop="prop"
        :label="label"
        :align="align || 'left'"
        :width="width"
        :sort-orders="['descending', 'ascending']"
        :sortable="sort === 'no' ? false : sortable"
        :formatter="actions.formatNumberAndEmpty">
        <template v-if="formatter" #default="scope">
          <slot v-if="formatter" :name="prop" :row="scope.row" :index="scope.$index"></slot>
        </template>
        <template v-if="type == 'image'" #default="scope">
          <el-image
            :src="scope.row[prop] !== '0' ? scope.row[prop] : '/logo.png'"
            fit="cover"
            class="max-w-[70px]"></el-image>
        </template>
        <template v-if="type == 'status'" #default="scope">
          <el-tag
            class="mx-1 !border-0"
            :color="scope.row[prop] ? '#bfccb5' : '#e9edc9'"
            effect="dark">
            {{ scope.row[prop] ? '啟用' : '停用' }}
          </el-tag>
        </template>
        <template v-if="type == 'date'" #default="scope">
          {{ dayjs(scope.row[prop]).format('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <!-- 功能列 -->
      <el-table-column
        v-if="rowButtons.length"
        width="140"
        align="center"
        fixed="right"
        label="功能">
        <template #default="scope">
          <section class="action-buttons flex items-center justify-center gap-x-3">
            <ButtonTipPermission
              v-for="(item, index) in rowButtons"
              :key="index"
              :type="item"
              @on-submit="emit('on-row-action-command', scope.row, item)">
            </ButtonTipPermission>
          </section>
        </template>
      </el-table-column>
      <el-table-column v-if="showActionCol" width="140" align="center" label="功能">
        <template #default="scope">
          <section class="action-buttons flex items-center justify-center gap-x-3">
            <slot name="action" :row="scope.row" :index="scope.$index"></slot>
          </section>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="尚無資料" :image-size="120"></el-empty>
      </template>
    </el-table>

    <!-- 自訂加總 -->
    <slot name="customSum"> </slot>

    <!-- 頁數切換 -->
    <footer
      v-if="propsTableData.total > 0 || (showOnlyPage && propsTableData.total > 0)"
      class="mt-auto flex items-center justify-center gap-4"
      :class="{ 'pt-3': showOnlyPage && propsTableData.total > 0 }">
      <div class="flex items-center gap-x-3">
        <p class="pl-1 text-xs text-gray-500">共 {{ propsTableData.total }} 筆</p>
      </div>
      <el-pagination
        v-model:current-page="propsTableData.current"
        layout="prev, pager, next"
        :small="true"
        background
        :total="propsTableData.total"
        :page-size="propsTableData.take"
        @current-change="actions.handleChange" />
    </footer>
  </main>
</template>
<script setup lang="ts">
import { tableStyle } from '@/utils/formatTable'
import { dayjs } from 'element-plus'
import { isEmpty, debounce } from 'lodash-es'
import { IButtonTipType } from '../Botton/ButtonTipPermission.vue'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    searchPlaceholder: string
    labelTextDate: string
    labelTextDateRange: string
    rowKey: string
    sortable: boolean | string
    tableData: any
    columns: IColumns[]
    alertRow: any
    showIndex: boolean
    showHeader: boolean
    showActionCol: boolean
    showFooter: boolean
    showOnlyPage: boolean
    showSelection: boolean
    showSelectedCol: boolean
    showExpandCol: boolean
    showSummary: boolean
    loading: boolean
    isExpand: boolean
    tableHeight: string | number
    actionButtons: string[]
    rowButtons: IButtonTipType[]
    cellLinks: string[]
    redCols: string[]
    setMaxHeight: boolean
    batchDropdowns: string[]
    batchType: string
  }>(),
  {
    searchPlaceholder: '請輸入',
    labelTextDate: '日期',
    labelTextDateRange: '更新日期',
    sortable: 'customs',
    showIndex: true,
    showHeader: true,
    showActionCol: false,
    showFooter: true,
    showOnlyPage: false,
    showSelection: true,
    showSelectedCol: false,
    showExpandCol: false,
    showSummary: false,
    loading: false,
    isExpand: false,
    tableHeight: '100vh',
    setMaxHeight: false,
    batchType: 'batch',
  },
)

// ----------- emit -----------
const emit = defineEmits([
  'on-change',
  'on-command',
  'on-selection',
  'search-keyword',
  'update:tableData',
  'cell-click',
  'row-click',
  'on-row-action-command', // 列按鈕
])

// ----------- ref -----------
const refDefaultTable = ref(null)
const multipleSelection = ref([])
const state = ref({
  search: '',
})

// ----------- watch -----------
watch(
  () => state.value.search,
  (newV, oldV) => {
    if (oldV && !newV) {
      actions.handleSearchByKeyword()
    }
  },
)
// ----------- computed ----------
const propsTableData = computed({
  get: () => props.tableData,
  set: (val) => {
    emit('update:tableData', val)
  },
})

// ----------- tableStyle ----------
const formatTableStyle = computed(() => {
  return props.isExpand ? tableStyle(props).expand : tableStyle(props).main
})

// ----------- actions ----------
const actions = {
  handleChange: () => {
    refDefaultTable.value.setScrollTop(0)
    emit('on-change')
  },

  handleCommand: (command: string) => {
    emit('on-command', command)
  },

  // 勾選
  handleSelectionChange: (val: any) => {
    multipleSelection.value = val
    emit('on-selection', val)
  },

  // 排序
  handleSortChange: (val: any) => {
    if (val.column) {
      const sortMap = {
        ascending: 'asc',
        descending: 'desc',
      }
      const sortByMap = {
        parent: 'id', // 階層
      }
      const sortBy = sortByMap[val.prop] || val.prop
      const sort = sortMap[val.order]
      propsTableData.value.sort = `${sortBy}-${sort}`
    } else {
      propsTableData.value.sort = `updated_at-desc`
    }
    emit('on-change')
  },

  // 點擊單元格
  handleCellClick: (row: any, column: any, cell: any, event: any) => {
    const params = {
      cell: column.property,
      row: row,
    }
    emit('cell-click', params)
  },

  // 點擊行
  handleRowClick: (row: any) => {
    emit('row-click', row)
  },

  // 搜尋 - 更新日期
  handleSearchByUpdateDate: (updated_at: string) => {
    propsTableData.value.search_params.updated_at = updated_at
    emit('on-change')
  },

  // 搜尋 - 日期區間
  handleSearchByDateRange: debounce((dateRange) => {
    const { start_date, end_date } = dateRange
    propsTableData.value.search_params.start_date = start_date
    propsTableData.value.search_params.end_date = end_date
    emit('on-change')
  }, 200),

  // 自動搜尋 - 關鍵字
  handleAutoSearch: debounce(function (query) {
    actions.handleSearchByKeyword()
  }, 200),

  // 搜尋 - 關鍵字
  handleSearchByKeyword: () => {
    propsTableData.value.search_params.q = state.value.search
    emit('search-keyword')
  },

  // 表格欄位為數字三位新增, / 表格欄位為空 預設顯示 '-'
  formatNumberAndEmpty: (row: any, column: any) => {
    const isNumber = column.align === 'is-right'
    if (isNumber) {
      if (typeof row[column.property] === 'number' || !isEmpty(row[column.property])) {
        return row[column.property] || 0
      } else {
        return '-'
      }
    } else {
      if (row[column.property]) {
        return row[column.property]
      } else {
        return '-'
      }
    }
  },

  handleShowButton: (action: string) => {
    return props.actionButtons.includes(action)
  },
  // 搜尋 - 關鍵字
  handleIndex: (index: any) => {
    const getData = propsTableData.value?.data || []
    const totalRow = getData.findIndex((dataItem: any) => dataItem.id == 'total')
    if (totalRow == index) {
      return ''
    }
    const no_page = !propsTableData.value?.take || !propsTableData.value?.current
    if (no_page) return index + 1
    const pageSize = propsTableData.value.take
    const currentPage = propsTableData.value.current

    const formatIndex = (currentPage - 1) * pageSize + index + 1
    return formatIndex
  },
}

defineExpose({ multipleSelection })
</script>
<style lang="scss" src="#/scss/custom/table.scss"></style>
