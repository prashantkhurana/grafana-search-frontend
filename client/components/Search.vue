<template>
  <div>

    <div class="field">
      <div class="control">
        <input class="input" type="text" placeholder="Text input" v-model="searchTerm">
      </div>
    </div>
    <!-- <p v-html="matches"></p> -->

    <table class="table is-striped is-fullwidth">
      <thead>
        <tr>
          <th>Dashboard Name</th>
          <th>Keywords</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>
        <!-- <tr v-for="dataAndName in filteredDashboardData" :key="dataAndName.item.name">
          <td>{{dataAndName.item.name}}</td>
          <td>{{dataAndName.item.keywords}}</td>
          <td>{{dataAndName.score}}</td>
          <td>{{dataAndName.matches}}</td>
        </tr> -->
        <tr v-for="dataAndName in matches" :key="dataAndName.name">
          <td v-html="dataAndName.name"></td>
          <td v-html="dataAndName.keywords"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import { Search, JsSearch } from "js-search";

var fuzzy = require('fuzzy');
console.log(fuzzy)

let fuse_options = {
  shouldSort: true,
  threshold: 0.3,
  location: 0,
  distance: 1000,
  maxPatternLength: 32,
  includeMatches: true,
  minMatchCharLength: 2,
  includeScore: true,
  // findAllMatches: true,
  tokenize: true,
  matchAllTokens: true,
  keys: ["name", "keywords"],
}

export default {
  data() {
    return {
      searchTerm: ""
    }
  },
  computed: {
    ...mapGetters({
      dashboardData: "grafana/dashboardData"
    }),
    fuse() {
      return new Fuse(this.dashboardData, fuse_options);
    },
    filteredDashboardData() {
      if (this.searchTerm === "") {
        // return this.dashboardData;
      }
      //let fuse = new Fuse(this.dashboardData, fuse_options);
      //console.log(this.fuse.search(""))
      return this.fuse.search(this.searchTerm);
    },
    matches() {
      var list = [
        { rompalu: 'baconing', zibbity: 'simba' }
        , { rompalu: 'narwhal', zibbity: 'mufasa' }
        , { rompalu: 'a mighty bear canoe', zibbity: 'saddam hussein' }
      ];
      var options = {
        pre: "<b>"
        , post: "</b>"
        , extract: function(el) { return el.name + "::" + el.keywords }
      };
      //console.log(this.dashboardData);
      if (this.dashboardData.test !== 0) {
        var results = fuzzy.filter(this.searchTerm, this.dashboardData, options);
        //var filtered = fuzzy.filter(search, directors, options);

        // Map the results to the html we want generated
        var results2 = results.slice(0, 50).map(function(el) {
          var items = el.string.split('::');
          return {name : items[0], keywords:items[1]}
        });
        console.log(results);
        return results2
      }
    },

  },
  methods: {
    ...mapActions({
      refreshDashboardData: "grafana/refreshDashboardData"
    })
  },
  mounted() {
    this.refreshDashboardData();
  }
}
</script>
