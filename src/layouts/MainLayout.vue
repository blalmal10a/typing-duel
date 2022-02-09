<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-avatar size="100px" style="border-radius: 50%;  border-color:aqua; border:1px solid ">
            <q-img
              src="../assets/invo.png"
              spinner-color="primary"
              spinner-size="82px"
            />
          </q-avatar>
        <q-toolbar-title>
          
          <span class="q-mt-xl" style="font-size: 200%" >
          TILTE DO LIST</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
