<template>
  <div>
    <div class="field">
      <div class="control">
        <input class="input" type="text" placeholder="Text input" v-model="searchTerm">
      </div>
    </div>
    <!-- <p v-html="matches"></p> -->
    <!-- <p>{{filteredDashboardData}}</p> -->

    <table class="table is-striped is-fullwidth">
      <thead>
        <tr>
          <th>Dashboard Name</th>
          <th>Charts</th>
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
        <tr v-for="dataAndName in filteredDashboardData" :key="dataAndName.Title">
          <td>{{dataAndName.Title}}</td>
          <td>
            <div v-for="row in dataAndName.Rows" :key="row.Title">
              <li v-for="panel in row.Panels" :key="panel.Title">
                <a :href="getUrl(dataAndName.Title, panel.Id)">{{panel.Title}}</a>
              </li>
            </div>
          </td>
          <td>{{dataAndName.Title}}</td>
        </tr>
        <!-- <tr v-for="dataAndName in matches" :key="dataAndName.name">
              <td v-html="dataAndName.name"></td>
              <td v-html="dataAndName.keywords"></td>
            </tr> -->
      </tbody>
    </table>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import { mapGetters } from 'vuex';
import { mapActions } from 'vuex';
import lunr from "../../node_modules/lunr";

var fuzzy = require('fuzzy');
console.log(fuzzy)

let fuse_options = {
  shouldSort: true,
  threshold: 0.7,
  location: 10,
  distance: 1000,
  maxPatternLength: 32,
  //includeMatches: true,
  minMatchCharLength: 2,
  //includeScore: true,
  // findAllMatches: true,
  tokenize: true,
  matchAllTokens: true,
  keys: [{
    name: 'Title',
    weight: 0.1
  }, {
    name: 'Rows.Panels.Title',
    weight: 0.7
  }]
}

let grafana_base_link = "https://grafana.dstillery.com/dashboard/db/";

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
      return this.fuse.search(this.searchTerm);
    },
    matches() {
      var options = {
        pre: "<b>"
        , post: "</b>"
        , extract: function(el) { return el.Title + "::" + el.Tags + "::" }
      };
      //console.log(this.dashboardData);
      if (this.dashboardData.test !== 0) {
        var results = fuzzy.filter(this.searchTerm, this.dashboardData, options);
        //var filtered = fuzzy.filter(search, directors, options);

        // Map the results to the html we want generated
        var results2 = results.slice(0, 50).map(function(el) {
          var items = el.string.split('::');
          return { name: items[0], keywords: items[1] }
        });
        console.log(results);
        return results2
      }
    },
    jsSearch() {
    }
  },
  methods: {
    ...mapActions({
      refreshDashboardData: "grafana/refreshDashboardData"
    }),
    getUrl(title, id) {
      //bidder-inventory?orgId=1&panelId=3&fullscreen
      let newTitle = title.replace(" ", "-");
      return grafana_base_link + newTitle + "?orgId=1&" + "panelId=" + id + "&fullscreen";
    }
  },
  created() {
    this.refreshDashboardData();
  }
}
</script>
