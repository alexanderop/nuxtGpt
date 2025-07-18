<script setup lang="ts">
const sidebarOpen = ref(true) // Default to open on desktop
</script>

<template>
  <div class="bg-gray-50 min-h-screen dark:bg-gray-900">
    <AppHeader />

    <div class="flex h-[calc(100vh-4rem)] relative">
      <!-- Desktop Sidebar -->
      <Transition name="slide-desktop">
        <aside
          v-if="sidebarOpen"
          class="border-r border-gray-200 bg-white w-64 hidden overflow-y-auto dark:border-gray-700 dark:bg-gray-800 lg:block"
        >
          <div class="p-4">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-sm text-gray-600 tracking-wider font-semibold uppercase dark:text-gray-400">
                Chat History
              </h2>
              <div class="group/close relative">
                <button
                  type="button"
                  class="p-1.5 rounded transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Close sidebar"
                  @click="sidebarOpen = false"
                >
                  <div class="i-carbon-side-panel-close text-gray-500 dark:text-gray-400" />
                </button>

                <!-- Tooltip -->
                <div class="text-xs text-white mt-1 px-2 py-1 rounded bg-gray-800 opacity-0 pointer-events-none whitespace-nowrap shadow-lg transition-opacity right-0 top-full absolute group-hover/close:opacity-100">
                  Close sidebar
                  <div class="border-b-4 border-l-4 border-r-4 border-b-gray-800 border-l-transparent border-r-transparent h-0 w-0 right-2 top-0 absolute -translate-y-1" />
                </div>
              </div>
            </div>
            <div class="text-sm text-gray-500 italic dark:text-gray-400">
              No previous chats
            </div>
          </div>
        </aside>
      </Transition>

      <!-- Sidebar toggle button (visible on all screens) -->
      <div class="group">
        <button
          v-if="!sidebarOpen"
          type="button"
          class="bg-primary text-white p-2 rounded-r-lg shadow-lg transition-all left-0 top-20 fixed z-50 hover:pl-3"
          aria-label="Open sidebar"
          @click="sidebarOpen = true"
        >
          <div class="i-carbon-side-panel-open text-xl" />
        </button>

        <!-- Tooltip for closed sidebar -->
        <div
          v-if="!sidebarOpen"
          class="text-xs text-white px-2 py-1 rounded bg-gray-800 opacity-0 pointer-events-none whitespace-nowrap shadow-lg transition-opacity left-12 top-20 fixed z-50 group-hover:opacity-100"
        >
          Open sidebar
          <div class="border-b-4 border-r-4 border-t-4 border-b-transparent border-r-gray-800 border-t-transparent h-0 w-0 left-0 top-1/2 absolute -translate-x-1 -translate-y-1/2" />
        </div>
      </div>

      <!-- Mobile sidebar toggle -->
      <button
        type="button"
        class="bg-primary text-white p-3 rounded-full shadow-lg bottom-4 left-4 fixed z-50 lg:hidden"
        @click="sidebarOpen = !sidebarOpen"
      >
        <div v-if="!sidebarOpen" class="i-carbon-menu text-xl" />
        <div v-else class="i-carbon-close text-xl" />
      </button>

      <!-- Mobile sidebar overlay -->
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="bg-black/50 inset-0 fixed z-40 lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>

      <!-- Mobile sidebar -->
      <Transition name="slide">
        <aside
          v-if="sidebarOpen"
          class="border-r border-gray-200 bg-white w-64 bottom-0 left-0 top-16 fixed z-50 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 lg:hidden"
        >
          <div class="p-4">
            <h2 class="text-sm text-gray-600 tracking-wider font-semibold mb-4 uppercase dark:text-gray-400">
              Chat History
            </h2>
            <div class="text-sm text-gray-500 italic dark:text-gray-400">
              No previous chats
            </div>
          </div>
        </aside>
      </Transition>

      <!-- Main content -->
      <main class="flex-1 overflow-hidden">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

.slide-desktop-enter-active,
.slide-desktop-leave-active {
  transition: all 0.3s ease;
}

.slide-desktop-enter-from,
.slide-desktop-leave-to {
  margin-left: -16rem; /* -w-64 */
  opacity: 0;
}
</style>
