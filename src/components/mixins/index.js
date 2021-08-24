export default {
    created() {
        document.addEventListener('keyup',  (evt)=> {
            if (evt.keyCode === 27) {
                this.onToggleBar();
            }
        });
    },
};