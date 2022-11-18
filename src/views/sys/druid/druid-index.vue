<template>
  <div>
    <iframe id="mobsf" src="http://localhost:9999/druid/login.html" scrolling="no" frameborder="0"></iframe>
  </div>
</template>

<script>
export default {
  data() {
    return {
      druidUrl: ''
    }
  },
  created() {
    this.druidUrl = process.env.VUE_APP_DRUID_URL
    console.log('druid ui:' + this.druidUrl)
  },
  mounted() {
    /**
     * iframe-宽高自适应显示
     */
    function changeMobsfIframe() {
      const mobsf = document.getElementById('mobsf')
      const deviceWidth = document.body.clientWidth
      const deviceHeight = document.body.clientHeight
      mobsf.style.width = Number(deviceWidth) - 100 + 'px' // 数字是页面布局宽度差值
      mobsf.style.height = Number(deviceHeight) - 80 + 'px' // 数字是页面布局高度差
      mobsf.style.width = '100%'
    }

    changeMobsfIframe()

    window.onresize = function() {
      changeMobsfIframe()
    }
  }
}
</script>
