<p align="center">
  <a href="https://github.com/sevdog/django-migration-check-action/actions"><img alt="javscript-action status" src="https://github.com/sevdog/django-migration-check-action/workflows/units-test/badge.svg"></a>
</p>

# JavaScript Action to check for Django default migration names

This action looks for Django default migration names (ie `xxxx_auto_yyyymmdd_hhmm.py`) and raises errors if any is found.

## Usage

You can consume the action by referencing the v1 branch

```yaml
uses: sevdog/django-migration-check-action@v1
with:
  type: project
  start-date: "2020-06-02T00:00:00"
  base-directory: "."
```

See the [actions tab](https://github.com/sevdog/django-migration-check-action/actions) for runs of this action! :rocket:
