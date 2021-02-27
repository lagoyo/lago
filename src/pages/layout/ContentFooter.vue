<template>
  <div class="footer">
    <div class="container">
      <nav>
        <ul>
          <li>
            <a href="https://schema.org/docs/schemas.html" target="schema">SCHEMA.ORG</a>
          </li>
          <li>
            <a href="https://github.com/lagoyo/lago" target="github-lago">
              LAGO Project
            </a>
          </li>
          <li>
            <a href="https://www.data.go.kr/" target="data.go.kr">
              DATA HUB of Korea Government
            </a>
          </li>
        </ul>
      </nav>
      <div class="copyright">
          &copy; {{ new Date().getFullYear() }}
          <a href="https://github.com/lagoyo/lago" target="github-lago">LAGO Project</a
          >, made with <i class="fa fa-heart heart"></i> for a collaborative data.
      </div>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style scoped lang="scss">
  .footer {
    padding: 0;

    .container {
      padding-right: 30px;
      padding-left: 30px;
      padding: 0;
      display: flex;

      ul {
        padding: 0;
        margin: 0;
        list-style: none;

        li {
          display: inline-block;

          a {
            color: inherit !important;
            padding-left: 15px;
            padding-right: 15px;
            font-weight: 300;
            font-size: 12px;
            text-transform: uppercase;
            border-radius: 0;
            text-decoration: none;
            position: relative;
            display: block;

            &:hover {
              text-decoration: none;
            }
          }
        }
      }
      .copyright {
        padding-right: 10px;
        padding-left: 10px;
        .material-icons {
          font-size: 18px;
          position: relative;
          top: 3px;
        }
      }

      .btn {
        margin-top: 0;
        margin-bottom: 0;
      }

    }

  }

</style>
