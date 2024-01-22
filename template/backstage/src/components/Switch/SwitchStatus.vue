<template>
  <el-switch
    v-model="model.status"
    inline-prompt
    :active-value="1"
    :inactive-value="0"
    active-color="#4DAAFF"
    inactive-color="#F36666"
    active-text="啟用"
    inactive-text="停用"
    @change="handleChangeStatus(model)" />
</template>

<script setup lang="ts">
const model = defineModel<any>()

const emit = defineEmits<{
  (e: 'on-change'): void
}>()

const route = useRoute()

const handleChangeStatus = (val: any) => {
  const id = val.id
  if (!id) return
  const program =
    route.path
      .split('/')
      .filter((item) => Boolean(item))
      .pop()! || ''
  const routeMap = {
    recharge_plan: 'plan',
    industry_category: 'posting_type',
    category_delegation: 'posting_type',
    services_provided: 'posting_type',
    computer_skill: 'posting_type',
    language_skill: 'posting_type',
    certification: 'posting_type',
    input_method: 'posting_type',
    education: 'posting_type',
  }
  const params = {
    program: routeMap[program] || program,
    id: val.id as number,
    status: val.status,
  }
  api.statusApi
    .changeStatus(params)
    .then((res) => {
      if (res.status) {
        notification.success({
          title: `${val.name ?? ''} 狀態已變更`,
        })
        emit('on-change')
      } else {
        return Promise.reject(res)
      }
    })
    .catch((err) => {
      notification.error({
        title: '狀態變更失敗',
        subTitle: err.message,
      })
      emit('on-change')
    })
}
</script>
