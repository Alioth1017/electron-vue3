'use strict';
module.exports = {
    lib: [],
    main: {
        props: {
            IComponentName: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                d_settings: null,
                d_exitprompt: null
            }
        },
        template: `<div class="head drag">
        <div>
        <span>{{$remote.app.name}} {{$remote.app.getVersion()}}</span>
        </div>
        <div class="no-drag">
        <i @click="settings" class="iconfont iconSettingscontrol no-drag cursor-pointer"></i>
        <i @click="system('mini')" class="iconfont iconMinus no-drag cursor-pointer"></i>
        <i @click="system('closed')" class="iconfont iconCancelcontrol no-drag cursor-pointer"></i>
        </div>
    </div>`,
        created() {
        },
        methods: {
            r(v) {
                return `${this.$parent.$options.name}.${this.$options._componentTag}.${v}`;
            },
            async settings() {
                this.$parent.$parent.dialogInit(
                    {
                        dialogName: '设置',
                        uniQueKey: 'dialog-subject-settings',
                        returnPath: this.r('d_settings')
                    }
                );
            },
            async system(channel) {
                if (channel !== 'closed') this.$ipcRenderer.send(channel);
                else {
                    this.$parent.$parent.dialogInit(
                        {
                            dialogName: '提示',
                            uniQueKey: 'dialog-subject-exitprompt',
                            returnPath: this.r('d_settings')
                        }
                    );
                }
            }
        },
        watch: {
            d_settings(v) {
                console.log(v.test);
            }
        }
    }
};
