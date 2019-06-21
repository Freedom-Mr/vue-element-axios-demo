<!---->
<template>
  <div class="address">
    <el-cascader
      :options="options"
      v-model="selectedOptions"
      @change="handleChange">
    </el-cascader>
  </div>
</template>

<script>
  import {area, province} from './cityJson'

  export default {
    data() {
      return {
        options: [],
        selectedOptions: []
      }
    },
    computed: {},
    components: {},
    methods: {
      handleChange(data) {
      }
    },
    created() {

      let options = [];
      let map = new Map();
      area.forEach(a => {
        let pid = a.pid.toString();
        if (map.has(pid)) {
          let temp = map.get(pid);
          temp.push({label:a.name,value:a.name})
          map.set(pid,temp)
        }else {
          map.set(pid,[{label:a.name,value:a.name}])
        }
      })


      province.forEach(d => {
        let children = [];

        d.city.forEach(f => {
          let fChild = [];
          if (map.has(f.id.toString())) {
            fChild = map.get(f.id.toString());
          }
          children.push({
            label: f.name,
            value: f.name,
            children: fChild
          });
        })

        options.push({
          label: d.name,
          value: d.name,
          children: children
        })
      })

      this.options = options;
      console.log(JSON.stringify(options))
    }
  }
</script>
