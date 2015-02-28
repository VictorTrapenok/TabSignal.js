
function tabSignal()
{
    if(!tabSignal.custom_id)
    {
        tabSignal.custom_id = Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()
        tabSignal.slotArray = new Array()
        tabSignal.debug = true
    }

    if(tabSignal.init === undefined) tabSignal.init = false

    return tabSignal;
}

/**
 * Подписывает слот на сигнал
 *
 * Если передать два параметра то они обработаются как  connect( signal_name, slot_function )
 * Если передать три параметра то они обработаются как  connect( slot_name, signal_name, slot_function )
 *
 * @param slot_name Имя слота
 * @param signal_name Имя сигнала
 * @param slot_function Функция вызваемая при вызове слота, должна иметь следующию сигнатуру function(param, signal_name){}
 *
 * <code>
 * Пример использования
 * new new signal().emit("catalogControl.OpenObject",{})
 *
 * </code>
 */
tabSignal.connect = function(slot_name, signal_name, slot_function)
{
    if(slot_function === undefined)
    {
        slot_function = signal_name;
        signal_name = slot_name;
        slot_name = Math.random()+""+Math.random()
    }

    if (tabSignal.slotArray[signal_name] === undefined)
    {
        tabSignal.slotArray[signal_name] = new Array()
    }
    tabSignal.slotArray[signal_name][slot_name] = slot_function;
    if(tabSignal.debug) console.log("На прослушивание сигнала " + signal_name + " добавлен слот " + slot_name + "", tabSignal.slotArray[signal_name])
    return slot_name;
}


/**
 * Отписывает слот slot_name от сигнала signal_name
 */
tabSignal.disconnect = function(slot_name, signal_name)
{
    if (tabSignal.slotArray[signal_name] === undefined)
    {
        tabSignal.slotArray[signal_name] = new Array()
    }

    if (tabSignal.slotArray[signal_name][slot_name] !== undefined)
    {
        delete tabSignal.slotArray[signal_name][slot_name]
    }
    if(tabSignal.debug) console.log("Отписываем слот " + slot_name + " от "+signal_name )
}

/**
 * Вызывает слоты подписаные на сигнал signal_name и каждому из них передаёт аруметы signal_name - имя вызвавшего сигнала, и param - объект с параметрами для слота)
 * В добавок ретранслирует сигнал в дочернии iframe если они есть и в родительское окно если оно есть
 * @param signal_name Имя сигнала
 * @param param Параметры переданые слоту при вызове в втором аргументе
 */
tabSignal.emit = function(signal_name, param)
{
    if (tabSignal.slotArray[signal_name] === undefined)last_custom_id
    {
        if(tabSignal.debug) console.log("На сигнал " + signal_name + " нет подписчиков" )
    }
    else
    {
        var slots = []
        for (var slot in tabSignal.slotArray[signal_name])
        {
            tabSignal.slotArray[signal_name][slot](param,signal_name)
            slots.push(slot)

        }
        if(tabSignal.debug) console.log("Сигнал " + signal_name + " подписаны слоты", slots )

    }
}

/*
 *  генерация события будут оповещены и соседние вкладки
 *  @eName string - имя события
 *  использование .emit('любое название события', [ Параметры события ])
 */
tabSignal.emitAll = function (signal_name, param)
{
    tabSignal.emit(signal_name, param)

    if(window['localStorage'] !==undefined  )
    {
        var curent_custom_id = Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()+"_"+Math.random()
        window['localStorage']['tabSignal_storage_emit']= JSON.stringify({name:signal_name, custom_id:curent_custom_id, param:param});
    }
}


if(!tabSignal.prototype.init)
{
    tabSignal.prototype.init = true
    if( window.addEventListener )
    {
        window.addEventListener('storage', function(e)
        {
            if(e.key && e.key == 'tabSignal_storage_emit')
            {
                try{
                    var data = JSON.parse(e.newValue);
                    if(data !== undefined && data.name !== undefined  )
                    {
                        if(tabSignal.debug > 1) console.log( data )
                        tabSignal().emit( data.name, data.param )
                    }
                }
                catch (failed)
                {
                }
            }
        }, false);
    }
    else
    {
        document.attachEvent('onstorage', function(e)
        {
            if(e.key && e.key == 'tabSignal_storage_emit')
            {
                try{
                    var data = JSON.parse(e.newValue);
                    if(data !== undefined && data.name !== undefined  )
                    {
                        if(tabSignal.debug > 1) console.log( data )
                        tabSignal().emit( data.name, data.param )
                    }
                }
                catch (failed)
                {
                }
            }
        } );
    }
}
