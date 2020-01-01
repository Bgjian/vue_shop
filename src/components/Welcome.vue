<template>
  <div class="welBox">
    <el-card shadow="hover">
      <!-- 面包屑 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">
          <span>Welcome Here</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 轮播图 -->
      <el-carousel :interval="4000" type="card" height="400px">
        <el-carousel-item v-for="(item,index) in urlData" :key="index">
          <img :src="item.background" />
        </el-carousel-item>
      </el-carousel>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      urlData: [
        { background: require('../assets/images/1.jpg') },
        { background: require('../assets/images/2.jpg') },
        { background: require('../assets/images/3.jpg') },
        { background: require('../assets/images/4.jpg') },
        { background: require('../assets/images/5.jpg') },
        { background: require('../assets/images/6.jpg') }
      ]
    }
  }
}
</script>

<style lang="less" scoped>
.welBox {
  span {
    font-size: 36px;
    font-weight: 700;
    font-family: "STXingkai";
    background-image: -webkit-gradient(
      linear,
      left 0,
      right 0,
      from(rgba(0, 0, 0, 0.726)),
      to(rgb(153, 153, 153))
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .el-carousel {
    margin-top: 20px;
  }
  .el-carousel__item img {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
