<template>
  <div class="login_container">
    <h1 class="swing animated">电商后台管理系统</h1>
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box bounceInDown animated">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
        status-icon
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-user"
            placeholder="请输入登录名称"
            autofocus
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
            placeholder="请输入登录密码"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    // 定义用户名的初步验证规则
    var checkName = (rule, value, callback) => {
      let leng = value.trim().length
      setTimeout(() => {
        if (!value.trim()) {
          return callback(new Error('请输入登录名称'))
        } else if (!(leng >= 3 && leng <= 10)) {
          return callback(new Error('长度在3到10个字符'))
        } else {
          callback()
        }
      }, 300)
    }
    // 定义密码的初步验证规则
    var checkPassword = (rule, value, callback) => {
      let leng = value.trim().length
      setTimeout(() => {
        if (!value.trim()) {
          return callback(new Error('请输入登录密码'))
        } else if (!(leng >= 6 && leng <= 15)) {
          return callback(new Error('长度在6到15个字符'))
        } else {
          callback()
        }
      }, 300)
    }
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: '',
        password: ''
      },
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [{ validator: checkName, trigger: 'blur' }],
        // 验证密码是否合法
        password: [{ validator: checkPassword, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置按钮，重置登录表单
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // 用户名和密码不合法时,return
        if (!valid) return
        const { data: res } = await this.axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败,用户名或密码错误！')
        }
        this.$message.success('登录成功!')

        // 登录成功之后的 token，保存到客户端的 sessionStorage中
        window.sessionStorage.setItem('Authorization', res.data.token)
        // 通过编程式导航跳转到后台主页，路由地址是 /home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(97, 194, 233);
  height: 100%;
  h1 {
    margin: 0 auto;
    position: absolute;
    top: 60px;
    left: 576px;
    font-family: "FangSong";
    font-size: 46px;
    // 字体颜色的渐变
    background-image: -webkit-gradient(
      linear,
      left 0,
      right 0,
      from(rgb(255, 255, 255)),
      to(rgb(0, 0, 0))
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 10px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 120px;
    width: 120px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    top: -70px;
    left: 156px;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
