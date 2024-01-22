<template>
  <el-dialog
    :model-value="propsVisible"
    class="custom-dialog custom-dialog-body mt-[10vh]"
    :close-on-click-modal="false"
    :lock-scroll="true"
    :title="`請選擇${params.title}`"
    @close="actions.handleClose">
    <div class="mt-3 flex flex-col">
      <!-- SearchBar -->
      <FormSearchBar
        v-model="state.table.search_params"
        :search-keyword="params.search_keyword"
        @on-change="actions.handleFetch" />
      <DefaultTable
        v-model:table-data="state.table"
        :columns="state.table.columns"
        :show-selection="false"
        :show-action-col="false"
        :show-header="false"
        :is-radio="true"
        table-height="60vh"
        :row-style="{ fontSize: '14px', height: '40px' }"
        :sortable="true"
        @on-change="actions.handleFetch"
        @row-click="actions.handleRowClick"
        @search-keyword="actions.handleFetch">
        <template #showSelectedCol>
          <el-table-column width="80" align="center">
            <template #default="scope">
              <el-radio v-model="state.radioValue" :label="scope.row.id">{{ '' }}</el-radio>
            </template>
          </el-table-column>
        </template>
        <template #name="scope">
          <span class="text-primary-400 cursor-pointer" v-text="scope.row.name"></span>
        </template>
      </DefaultTable>
      <footer class="flex justify-end border-t py-3">
        <el-button size="large" text bg @click="actions.handleClose">取消</el-button>
        <el-button
          size="large"
          type="primary"
          :disabled="!Boolean(state.table.data.find((val) => val.id === state.radioValue))"
          @click="actions.handleSubmit"
          >確定</el-button
        >
      </footer>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
// ----------- props -----------
const props = defineProps<{
  params: IRadio
}>()

// ----------- emit -----------
const emit = defineEmits(['on-close', 'on-submit'])

const propsVisible = defineModel('dialogVisible', { required: true, default: false })

// ----------- data -----------
const state = ref({
  radioValue: '',
  table: {
    data: [],
    columns: [],
    current: 1,
    take: 20,
    total: 1,
    search_params: {
      q: '',
    },
  },
})
// ----------- watch ----------
watch(
  () => propsVisible.value,
  (newV, oldV) => {
    if (newV && newV !== oldV) {
      state.value.table.current = 1
      state.value.table.search_params = {
        q: '',
      }
      state.value.radioValue = props.params?.selected || ''
      actions.handleFetch()
    }
  },
)
// ----------- methods -----------
const actions = {
  /**
   * @description 取得列表
   */
  handleFetch: () => {
    const { current: page, take, search_params } = state.value.table
    const params: any = {
      page,
      take,
      ...search_params,
    }
    if (props.params.type) {
      params.type = props.params.type
    }
    api[props.params.api].fetchAll(params).then((result) => {
      const { data } = result
      const { current_page: current = 1, total = 1, per_page: take = 20 } = result

      state.value.table = {
        data,
        columns: props.params.columns,
        total,
        take: Number(take),
        current,
        search_params,
      }
    })
  },
  handleRowClick: (params: any) => {
    state.value.radioValue = params.id
  },
  handleSubmit: () => {
    const data = state.value.table.data
    const selected = data.find((val) => val.id === state.value.radioValue)
    emit('on-submit', selected)
    state.value.radioValue = ''
    state.value.table.current = 1
    state.value.table.search_params = {
      q: '',
    }
  },

  handleClose: () => {
    propsVisible.value = false
    emit('on-close')
  },
}
</script>

<style lang="scss">
.custom-dialog {
  .el-radio {
    --el-radio-input-height: 18px;
    --el-radio-input-width: 18px;
  }
}
</style>
