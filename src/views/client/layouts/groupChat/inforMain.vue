<template>
  <div class="inforMax">
    <div class="inforTop">
      <div class="groupName">柒总没有钱</div>
      <span
        ><svg
          @click="exendMation()"
          t="1714641807092"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5427"
          width="200"
          height="200"
        >
          <path
            d="M164.3 512.2m-100 0a100 100 0 1 0 200 0 100 100 0 1 0-200 0Z"
            p-id="5428"
            fill="#65bb96"
          ></path>
          <path
            d="M512.3 512.2m-100 0a100 100 0 1 0 200 0 100 100 0 1 0-200 0Z"
            p-id="5429"
            fill="#65bb96"
          ></path>
          <path
            d="M860.4 512.2m-100 0a100 100 0 1 0 200 0 100 100 0 1 0-200 0Z"
            p-id="5430"
            fill="#65bb96"
          ></path></svg
      ></span>
    </div>
    <div class="inforMain">
      <div class="chatmain">
        <div class="inforList">
          <chatMessageList />
        </div>
        <div class="inforSend" v-show="!showCheckedflag">
        
          <input placeholder="发送消息" v-model="nowText" />
          <button class="inforMainSend">发送</button>
          <chatFileVue />
        </div>
        <div class="inforSend" v-show="showCheckedflag">
          <messageShareVue/>
        </div>
      </div>
      <div class="inforSider" v-if="isgroup">
        <div class="notoce">
          <div class="title">
            <span>群公告</span>
            <span
              ><svg
                @click="exendAffiche()"
                t="1714652077129"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="6694"
                width="200"
                height="200"
              >
                <path
                  d="M704 429.714286l-312.685714-340.114286a53.394286 53.394286 0 0 0-36.571429-16.457143 52.297143 52.297143 0 0 0-38.4 16.457143 53.028571 53.028571 0 0 0 0 76.8l312.685714 340.114286c5.485714 5.485714 5.485714 10.971429 0 10.971428l-318.171428 340.114286A52.297143 52.297143 0 0 0 292.571429 896a53.394286 53.394286 0 0 0 16.457142 38.4A73.142857 73.142857 0 0 0 347.428571 950.857143a50.834286 50.834286 0 0 0 38.4-16.457143l312.685715-340.114286a106.422857 106.422857 0 0 0 5.485714-164.571428z"
                  p-id="6695"
                  fill="#65bb96"
                ></path></svg
            ></span>
          </div>
          <div class="noticemain">
            <span class="noticetxt">
             {{ notice}}
            </span>
          </div>
        </div>
        <div class="member" @click.stop>
          <div class="title" v-if="!isearch">
            <span>群成员</span>
            <span @click="research()"
              ><svg
                t="1714653715024"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="7950"
                width="200"
                height="200"
              >
                <path
                  d="M950.784 899.584l-168.448-167.936c64.512-74.752 99.84-168.96 99.84-268.8 0-110.08-43.008-212.992-120.32-290.816S581.12 51.2 471.552 51.2c-110.08 0-212.992 43.008-290.816 120.32-77.824 77.824-120.832 181.248-120.832 291.328s43.008 212.992 120.32 290.816c77.824 77.824 181.248 120.32 290.816 120.32 90.624 0 177.152-29.184 248.32-82.944l169.984 169.984c8.192 8.192 19.456 12.8 30.72 12.8s22.016-4.096 30.72-12.8c16.896-16.896 16.896-44.544 0-61.44zM146.432 462.848C146.432 283.648 292.352 138.24 471.04 138.24c179.2 0 324.608 145.92 324.608 324.608 0 179.2-145.408 324.608-324.608 324.608s-324.608-145.92-324.608-324.608z"
                  fill="#65bb96"
                  p-id="7951"
                ></path></svg
            ></span>
          </div>
          <div class="search" v-if="isearch">
            <input
              type="text"
              v-model="searchname"
              @input="inputChange"
              name=""
              id=""
            />
            <svg
              t="1714653715024"
              class="sericon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="7950"
              width="200"
              height="200"
            >
              <path
                d="M950.784 899.584l-168.448-167.936c64.512-74.752 99.84-168.96 99.84-268.8 0-110.08-43.008-212.992-120.32-290.816S581.12 51.2 471.552 51.2c-110.08 0-212.992 43.008-290.816 120.32-77.824 77.824-120.832 181.248-120.832 291.328s43.008 212.992 120.32 290.816c77.824 77.824 181.248 120.32 290.816 120.32 90.624 0 177.152-29.184 248.32-82.944l169.984 169.984c8.192 8.192 19.456 12.8 30.72 12.8s22.016-4.096 30.72-12.8c16.896-16.896 16.896-44.544 0-61.44zM146.432 462.848C146.432 283.648 292.352 138.24 471.04 138.24c179.2 0 324.608 145.92 324.608 324.608 0 179.2-145.408 324.608-324.608 324.608s-324.608-145.92-324.608-324.608z"
                fill="#65bb96"
                p-id="7951"
              ></path>
            </svg>
            <svg
              @click="reinput()"
              v-if="isput"
              t="1714654685810"
              class="canicon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8999"
              width="200"
              height="200"
            >
              <path
                d="M103.34374999 866.46875001l354.65625001-354.65625001L103.34374999 157.0625c-14.90625001-14.90625001-14.90625001-39.09375001 2e-8-54 14.90625001-14.90625001 39.09375001-14.90625001 54 0L512 457.71874999 866.75 103.0625c14.90625001-14.90625001 39.09375001-14.90625001 54 0 14.90625001 14.90625001 14.90625001 39.09375001 0 54L566 511.71874999 920.75 866.46875001c14.90625001 14.90625001 14.90625001 39.09375001 0 53.99999998-7.50000001 7.40625001-17.25 11.15625001-27 11.15625001s-19.50000001-3.75-27-11.15625001L512.09375001 565.71875001 157.34374999 920.375c-7.50000001 7.40625001-17.25 11.15625001-26.99999998 11.15625001-9.75 0-19.50000001-3.75-27-11.15625001-14.90625001-14.90625001-14.90625001-39 0-53.90625001z"
                fill="#515151"
                p-id="9000"
              ></path>
            </svg>
          </div>
          <ul class="userList">
            <li class="selectChat">
              <div class="avatar">
                <img src="@/assets/images/userPhoto/userphotojpg.jpg" alt="" />
              </div>
              <div class="username">柒总没有钱</div>
            </li>
          </ul>
        </div>
      </div>
      <mation :maexend="maexend" @exend-affiche="exendAffiche" />
    </div>
    <affiche
      class="cov"
      :isexend="isexend"
      @close-affiche="closeAffiche"
      @exend-send="exendSend"
    />
    <send-notice class="cov" :issend="issend" @colse-send="closeSend" />
  </div>
</template>

<script lang="ts">
import chatMessageList from "./chatMessageList.vue";
import messageShareVue from './chatFile/messageShare.vue'
import { computed, onMounted, reactive, ref } from "vue";
export default {
  data() {
    return {
      isearch: false,
      isput: false,
      isexend: false,
      issend: false,
      maexend: false,
      isgroup: true,
      searchname: "",
    };
  },
  methods: {
    research() {
      this.isearch = true;
    },
    reinput() {
      this.isput = false;
      this.searchname = "";
    },
    cansearch() {
      const member = this.$el.querySelector(".member");
      if (!(member && member.contains(event.target))) {
        this.isearch = false;
        this.isput = false;
      }
    },
    closeMation() {
      const member = this.$el.querySelector(".mation");
      const btn = this.$el.querySelector(".icon");
      const cov = this.$el.querySelector(".cov");
      if (
        !(member && member.contains(event.target)) &&
        !(btn && btn.contains(event.target)) &&
        !(cov && cov.contains(event.target))
      ) {
        this.maexend = false;
        this.$router.push("/mainMation");
      }
    },
    inputChange() {
      if (event.target.value.trim() === "") {
        this.isput = false;
      } else {
        this.isput = true;
      }
    },
    exendAffiche() {
      this.isexend = true;
    },
    closeAffiche() {
      this.isexend = false;
    },
    exendSend() {
      this.issend = true;
    },
    closeSend() {
      this.issend = false;
    },
    exendMation() {
      this.maexend = !this.maexend;
      this.$router.push("/mainMation");
      this.isexend = false;
    },
  },
  mounted() {
    document.addEventListener("click", this.cansearch);
    document.addEventListener("click", this.closeMation);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.cansearch);
    document.removeEventListener("click", this.closeMation);
  },
};
</script>
<script lang="ts" setup>
import affiche from "./affiche.vue";
import chatFileVue from "./chatFile.vue";
import mation from "./mation.vue";
import chatMessageList from "./chatMessageList.vue";
import sendNotice from "./sendNotice.vue";
import  useMainStore from "@/store/chat/chat.ts";
import { storeToRefs } from "pinia";
import messageShareVue from './chatFile/messageShare.vue';
const mainStore = useMainStore();
const{nowText,groupName,notice,showCheckedflag}=storeToRefs(mainStore)

</script>

<style lang="scss" scoped>
@import "@/views/client/styles/groupChat/inforMain.scss";
</style>