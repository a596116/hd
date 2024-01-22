<template>
  <main
    v-loading="isExpand ? false : useCommonStore().loading"
    class="relative flex flex-col w-full h-full draggable">
    <slot name="tableHeader"></slot>
    <!-- 關鍵字、日期搜尋 -->
    <section
      v-if="showHeader"
      class="flex justify-between px-3 py-2"
      :class="{ 'py-4': !showSearchInput }">
      <section class="flex flex-col items-center gap-2 md:flex-row">
        <div v-if="showSearchInput" class="w-full md:min-w-[300px] lg:w-fit">
          <h5 class="text-xs leading-6 tracking-widest text-gray-500">關鍵字搜尋</h5>
          <el-input
            class="rounded-md"
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

        <!-- 搜尋 -->
        <div class="flex self-end justify-center w-full lg:justify-start">
          <!-- <div class="w-full lg:max-w-min">
            <el-button
              type="primary"
              class="w-full font-normal text-white"
              auto-insert-space
              @click="actions.handleChange">
              <svg-icon name="search" class="mr-2 h-[16px] w-[16px]"></svg-icon>
              搜 尋
            </el-button>
          </div> -->
          <div>
            <slot name="advancedSearch"></slot>
          </div>
        </div>
      </section>

      <section
        v-if="actionButtons?.length > 0 && showHeader"
        class="flex items-end justify-end flex-grow h-full ml-auto"
        :class="{ 'gap-x-3': actions.handleShowButton('batch') }">
        <ButtonCreate
          v-if="actions.handleShowButton('create')"
          @on-create="actions.handleCommand('create')" />
      </section>
    </section>

    <!-- 批次設定 / 頁數切換、重整-->
    <!-- <section class="flex items-center justify-between px-4 my-2">
      <section class="flex items-center gap-x-6">
        <transition name="slide-fade" mode="out-in">
          <section v-if="multipleSelection?.length > 0" class="flex items-center gap-x-3">
            <small class="tracking-widest font-base text-primary-dark-text">
              已選
              <strong class="font-medium text-hd-primary">{{ multipleSelection?.length }}</strong>
              項
            </small>

            <ButtonGroupPermission @on-command="actions.handleCommand" />
          </section>
        </transition>
      </section>
    </section> -->
    <!-- 表格 -->
    <el-table
      ref="refDefaultTable"
      tooltip-effect="light"
      max-height="100%"
      :height="tableHeight"
      class="h-full cursor-default default-table"
      style="width: 100%"
      size="small"
      empty-text="尚無資料"
      :data="isExpand ? propsValuesData : propsTableData.data"
      :row-key="rowKey ? rowKey : (row) => row.id"
      table-layout="fixed"
      :show-summary="showSummary"
      :header-cell-style="formatTableStyle.header"
      :row-style="rowStyle || formatTableStyle.row"
      :row-class-name="formatTableStyle.tableRowClassName"
      :cell-class-name="formatTableStyle.tableColClassName"
      @selection-change="actions.handleSelectionChange"
      @sort-change="actions.handleSortChange"
      @cell-click="actions.handleCellClick"
      @row-click="actions.handleRowClick">
      <slot name="showSelectedCol"></slot>
      <!-- 拖曳 -->
      <el-table-column
        v-if="showDragCol"
        label="排序"
        width="55"
        align="center"
        class-name="drag-handle">
        <template #default="scope">
          <svg-icon name="drag-handle" class="cursor-pointer text-hd-dark"></svg-icon>
        </template>
      </el-table-column>
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
        class-name="text-hd-dark"
        :index="actions.handleIndex" />
      <!-- expand -->
      <el-table-column v-if="showExpandCol" width="55" align="center" type="expand">
        <template #default="scope">
          <slot name="expand" :row="scope.row"></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-for="{
          prop,
          label,
          align,
          width,
          formatter,
          sort,
          type,
          path,
          params,
          query,
          target,
        } in columns"
        :key="prop"
        :prop="prop"
        :label="label"
        :align="align || 'left'"
        :width="width"
        :sort-orders="['descending', 'ascending']"
        :sortable="sort === 'no' || isDraggable ? false : sortable"
        :formatter="actions.formatNumberAndEmpty">
        <template v-if="formatter" #default="scope">
          <slot v-if="formatter" :name="prop" :row="scope.row" :index="scope.$index"></slot>
        </template>
        <!-- 圖片 -->
        <template v-if="type == 'image'" #default="scope">
          <el-image
            :src="scope.row[prop] !== '0' ? scope.row[prop] : '/logo.png'"
            fit="contain"
            :preview-src-list="[scope.row[prop]]"
            :preview-teleported="true"
            :hide-on-click-modal="true"
            class="h-[120px] w-[120px]"></el-image>
        </template>
        <!-- status -->
        <template v-if="type == 'status'" #default="scope">
          <SwitchStatus v-model="scope.row" @on-change="emit('on-change')" />
        </template>
        <!-- money -->
        <template v-if="type == 'money'" #default="scope">
          {{ formatNumber(scope.row[prop]) }}
        </template>
        <!-- 日期 -->
        <template v-if="type == 'date'" #default="scope">
          {{ dayjs(scope.row[prop]).format('YYYY-MM-DD') }}
        </template>
        <!-- 連結 -->
        <template v-if="type == 'link'" #default="scope">
          <Anchor :href="scope.row[prop]">
            <span v-textLine="1">{{ scope.row[prop] }}</span>
          </Anchor>
        </template>
        <template v-if="path" #default="scope">
          <Anchor
            class="text-[#1E9AD6] hover:text-[#0C7DA6]"
            :target="target || '_self'"
            :to="{
              path: `${path}/${scope.row[params]}`,
              query: query
                ? {
                    ...Object.fromEntries(
                      Object.entries(query).map(([key, value]: any) => [key, scope.row[value]]),
                    ),
                  }
                : {},
            }">
            {{ scope.row[prop] }}
          </Anchor>
        </template>
      </el-table-column>
      <!-- 功能列 -->
      <el-table-column v-if="showActionCol" width="120" align="center" label="操作" fixed="right">
        <template #default="scope">
          <section class="flex items-center justify-center action-buttons gap-x-3">
            <slot name="action" :row="scope.row" :index="scope.$index"></slot>
          </section>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty v-if="showEmpty" description="尚無資料" :image-size="120"></el-empty>
      </template>
    </el-table>

    <!-- 自訂加總 -->
    <slot name="customSum"> </slot>

    <!-- 頁數切換 -->
    <template v-if="showFooter">
      <section
        v-if="propsTableData.total > 0 || (showOnlyPage && propsTableData.total > 0)"
        class="sticky bottom-0 left-0 flex items-center justify-between px-4">
        <div class="flex items-center gap-x-3">
          <p class="pl-1 text-xs text-gray-500">共 {{ propsTableData.total }} 筆</p>

          <!-- <SelectPageSize
            v-model:take="propsTableData.take"
            :total="propsTableData.total"
            @on-change="actions.handleChange" /> -->
        </div>
        <section v-if="!isDraggable" class="gap-4 center">
          <el-pagination
            v-model:current-page="propsTableData.current"
            layout="prev, pager, next"
            :small="true"
            background
            :total="propsTableData.total"
            :page-size="propsTableData.take"
            @current-change="actions.handleChange" />
        </section>
        <el-button round type="default" class="p-2 my-1" @click="actions.handleChange">
          <svg-icon name="refresh" class="w-3 h-3"></svg-icon>
        </el-button>
      </section>
    </template>
  </main>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { formatNumber } from '@/utils/formatNumber'
import { tableStyle } from '@/utils/formatTable'
import { TableInstance, dayjs } from 'element-plus'
import { isEmpty, debounce } from 'lodash-es'
import Sortable from 'sortablejs'

const route = useRoute()
const router = useRouter()

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    searchPlaceholder?: string
    labelTextDate?: string
    labelTextDateRange?: string
    rowKey?: string
    sortable?: boolean | string
    columns: IColumns[]
    alertRow?: any[]
    showIndex?: boolean
    showHeader?: boolean
    showActionCol?: boolean
    showFooter?: boolean
    showOnlyPage?: boolean
    showSelection?: boolean
    showSelectedCol?: boolean
    showExpandCol?: boolean
    showSummary?: boolean
    showSearchInput?: boolean
    showEmpty?: boolean
    rowStyle?: any
    loading?: boolean
    isExpand?: boolean
    isRadio?: boolean
    tableHeight?: string | number
    actionButtons?: string[]
    batchDropdowns?: string[]
    batchType?: string
    // 拖曳
    isDraggable?: boolean // 是否開啟拖曳
    draggableHandle?: string // 拖曳手把手
    showDragCol?: boolean // 是否顯示拖曳欄位
  }>(),
  {
    searchPlaceholder: '請輸入',
    labelTextDate: '日期',
    labelTextDateRange: '更新日期',
    rowKey: '',
    sortable: 'customs',
    tableData: {},
    showIndex: true,
    showHeader: true,
    showActionCol: false,
    showFooter: true,
    showOnlyPage: false,
    showSelection: true,
    showSelectedCol: false,
    showExpandCol: false,
    showSummary: false,
    showSearchInput: true,
    showEmpty: true,
    loading: false,
    isExpand: false,
    tableHeight: '100vh',
    batchType: 'batch',
    isDraggable: false,
    draggableHandle: '',
    showDragCol: false,
  },
)

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-change'): void
  (e: 'on-command', command: string): void
  (e: 'on-selection', val: any[]): void
  (e: 'search-keyword'): void
  (e: 'cell-click', params: { cell: string; row: any }): void
  (e: 'row-click', row: any): void
  (e: 'on-drag', val: any): void
}>()

onMounted(() => {
  const { t = null, c = null, q = null } = route.query
  if (t) {
    propsTableData.value.take = Number(t)
  }
  if (c) {
    propsTableData.value.current = Number(c)
  }
  if (q) {
    if (!props.isExpand) {
      state.value.search = String(q)
      propsTableData.value.search_params.q = q
    }
    actions.handleSearchByKeyword()
  }
  if (props.isDraggable) {
    actions.handleDrag()
  }
})

// ----------- ref -----------
const refDefaultTable = ref<TableInstance>()
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
const propsTableData = defineModel<any>('tableData')

const propsValuesData = defineModel<any>('values')

watch(
  () => propsValuesData.value,
  (newV, oldV) => {
    // 加上timestamp
    if (props.isDraggable) {
      newV?.forEach((item, index) => {
        item.timestamp = new Date().getTime() + index
      })
    }
  },
)

// ----------- tableStyle ----------
const formatTableStyle = computed(() => {
  return props.isExpand ? tableStyle(props).expand : tableStyle(props).main
})

// ----------- actions ----------
const actions = {
  handleChange: () => {
    if (!props.isExpand && !props.isRadio) {
      const query = {
        t: propsTableData.value.take,
        c: propsTableData.value.current,
        q: propsTableData.value.search_params.q,
      }
      router.push({ query })
    }
    refDefaultTable.value.setScrollTop(0)
    emit('on-change')
  },

  handleCommand: (command: any) => {
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
        creator: 'creator_id',
        member_name: 'm_id',
        member_mp: 'm_id',
        member_email: 'm_id',
        role_name: 'id',
      }
      const sortBy = sortByMap[val.prop] || val.prop
      const sort = sortMap[val.order] || 'desc'
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
    if (!props.isExpand && !props.isRadio) {
      const params = {
        t: propsTableData.value.take,
        c: propsTableData.value.current,
        q: propsTableData.value.search_params.q,
      }
      router.push({ query: params })
    }
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
    return props.actionButtons?.includes(action)
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

  handleDrag: () => {
    let tbody = document.querySelector('.draggable .el-table__body-wrapper tbody')
    const conf = {
      animation: 150, // ms, number 单位：ms，定义排序动画的时间
      handle: '.el-table__row', // 拖动手柄
      draggable: '.el-table__row',
      onStart: function (e: any) {
        propsValuesData.value ? propsValuesData.value.push({}) : propsTableData.value.data.push({})
        nextTick(() => {
          const elTableBody = document.querySelector(
            '.draggable .el-table__body .el-table__row:last-child',
          )
          elTableBody?.classList.add('hidden')
        })
      },
      onEnd({ newIndex, oldIndex }) {
        if (propsValuesData.value) {
          const currentRow = propsValuesData.value.splice(oldIndex, 1)[0]
          propsValuesData.value.splice(newIndex, 0, currentRow)
          propsValuesData.value.pop()
          emit('on-drag', propsValuesData.value)
        } else {
          const currentRow = propsTableData.value.data.splice(oldIndex, 1)[0]
          propsTableData.value.data.splice(newIndex, 0, currentRow)
          propsTableData.value.data.pop()
          emit('on-drag', propsTableData.value.data)
        }
      },
    }
    if (props.showDragCol) {
      conf.handle = '.drag-handle'
    } else if (props.draggableHandle) {
      conf.handle = props.draggableHandle
    } else {
      conf.draggable = '.el-table__row'
    }
    Sortable.create(tbody, conf)
  },
}

defineExpose({ multipleSelection })
</script>
