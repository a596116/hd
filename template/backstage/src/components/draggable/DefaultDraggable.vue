<template>
  <main
    v-loading="useCommonStore().loading"
    class="relative flex h-full w-full flex-col justify-start px-2">
    <div class="flex h-full flex-col" :class="{ 'gap-y-2': showHeaderAndFooter }">
      <section
        v-if="showHeaderAndFooter"
        class="flex w-full items-center justify-between border-b pb-2">
        <div>
          <slot name="radio"></slot>
        </div>
      </section>

      <!-- Buttons -->
      <section
        class="flex items-center justify-end border-b py-2 pb-2"
        :class="{ 'gap-x-3': actions.handleShowButton('batch') }">
        <slot name="button"></slot>
        <ButtonCreate
          v-if="actions.handleShowButton('create')"
          :disabled="state.canDrag"
          @on-create="actions.handleCommand('create')" />
      </section>

      <!-- Draggable -->
      <Draggable
        v-model="propsTableData.data"
        :max-level="maxLeavel"
        :disable-drag="disableDrag"
        @change="emit('on-change')"
        class="default-draggable flex-1">
        <template #default="scope">
          <div
            class="relative flex flex-wrap items-center"
            :class="{
              l1: scope.indentStyle.paddingLeft == '0px',
              l2: scope.indentStyle.paddingLeft == '20px',
              l3: scope.indentStyle.paddingLeft == '40px',
            }">
            <transition name="slide-left-fade" mode="out-in">
              <svg-icon
                v-if="!disableDrag"
                name="dial"
                class="ml-1 h-5 w-5 cursor-pointer text-gray-400" />
            </transition>
            <section
              class="flex flex-1 items-center"
              :style="{
                'padding-left': `${padding}px`,
              }">
              <div
                v-for="({ prop, width, formatter, path, params, type, query }, index) in columns"
                :key="index"
                class="mx-2"
                :class="`w-[${width ?? 150}px]`">
                <template v-if="path">
                  <Anchor
                    class="text-[#1E9AD6] hover:text-[#0C7DA6]"
                    :to="{
                      path: `${path}/${scope.node[params]}`,
                      query: query
                        ? {
                            ...Object.fromEntries(
                              Object.entries(query).map(([key, value]: any) => [
                                key,
                                scope.node[value],
                              ]),
                            ),
                          }
                        : {},
                    }">
                    {{ scope.node[prop] }}
                  </Anchor>
                </template>
                <slot v-if="formatter" :name="prop" :row="scope.node" :index="index"></slot>
                <!-- <span v-else>
                  {{ scope.node[prop] }}
                </span> -->
              </div>
            </section>

            <section class="action-buttons ml-auto mr-3 flex items-center justify-center gap-x-3">
              <slot name="action" :row="scope.node" :index="scope.node.id"></slot>
            </section>
          </div>
        </template>
      </Draggable>
      <footer
        v-if="propsTableData.total > 0"
        class="sticky bottom-0 flex items-center justify-between border-t bg-hd-bg-1 px-4">
        <div class="flex items-center gap-x-3">
          <p class="pl-1 text-xs text-gray-500">共 {{ propsTableData.total }} 筆</p>
        </div>
        <el-button round type="default" class="my-1 p-2" @click="emit('on-refresh')">
          <svg-icon name="refresh" class="h-3 w-3"></svg-icon>
        </el-button>
      </footer>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { Draggable } from '@he-tree/vue'
import '@he-tree/vue/style/default.css'

const route = useRoute()
// ----------- props -----------
const props = withDefaults(
  defineProps<{
    columns: IColumns[]
    maxLeavel?: number
    showHeaderAndFooter?: boolean
    showSetting?: boolean
    actionButtons?: string[]
    padding?: number
    disableDrag?: boolean
    loading?: boolean
  }>(),
  {
    maxLeavel: 1,
    showHeaderAndFooter: true,
    showSetting: true,
    actionButtons: () => ['create'],
    padding: 24,
    disableDrag: false,
    loading: false,
  },
)

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-change'): void
  (e: 'on-command', command: string): void
  (e: 'on-refresh'): void
}>()

// ----------- computed ----------
const propsTableData = defineModel<any>('data', { required: true })

// ----------- data -----------
const state = reactive({
  drag: false,
  canDrag: false,
})

// ----------- methods ----------
const actions = {
  handleCommand: (command: string) => {
    emit('on-command', command)
    if (command === 'sort') {
      state.canDrag = !state.canDrag
    }
  },

  handleShowButton: (action: string) => {
    return props.actionButtons.includes(action)
  },
}
</script>
